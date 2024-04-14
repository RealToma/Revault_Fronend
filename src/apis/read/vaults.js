import Big from "big.js";

const { ethers } = require("ethers");
const { BigNumber } = require("ethers");

const systemConfig = require("../../config/config").config.getSystemConfig();
const addresses = require("../../config/config").config.getNetworkAddresses();
const { getVault, getToken, getTokenByAddress } = require("../utils/addresses");

const { format } = require("../utils/format.js");

const bunnyVaultAbi = require("../../abi/IBunnyVault.json");
const bunnyMinterAbi = require("../../abi/IBunnyMinterV2.json");

const beefyVaultAbi = require("../../abi/IBeefyVault.json");
const beefyStrategyVenusBNBV2 = require("../../abi/IBeefyStrategyVenusBNBV2.json");
const beefyStrategyCakeV2 = require("../../abi/IBeefyStrategyCakeV2.json");
const beefyStrategyCakeLP = require("../../abi/IBeefyStrategyCakeLP.json");
const beefyStrategyCakeLPDynamic = require("../../abi/IBeefyStrategyCakeLPDynamicWithdrawalFee.json");
const beefyStrategyCommonChefLP = require("../../abi/IBeefyStrategyCommonChefLPBsc.json");

const autofarmVaultAbi = require("../../abi/IAutoFarm.json");
const autofarmStratXAbi = require("../../abi/IAutoFarmStratX.json");
const autofarmStratX2PCSAbi = require("../../abi/IAutoFarmStratX2PCS.json");

const zapAbi = require("../../abi/Zap.json");

const { getApy } = require("./apy");
const { getTokenToBusdRate } = require("./tokens");
const { getGasPrice, getGasLimit } = require("./network");
const { rebalanceAll } = require("../write/revault");
const {
  getUserProxyContractAddress,
  getUserVaultPrincipal,
} = require("./revault");

// Bunny

async function getBunnyWithdrawFeeParams(provider) {
  // Assuming bunny minter address from config (technically it can be different between vaults + dynamically be changed)
  const bunnyMinterContract = new ethers.Contract(
    addresses.bunny.minter,
    bunnyMinterAbi,
    provider,
  );

  const withdrawalFeeFactor = await bunnyMinterContract.WITHDRAWAL_FEE();
  const withdrawalFeeMax = await bunnyMinterContract.FEE_MAX();
  return { withdrawalFeeFactor, withdrawalFeeMax };
}

async function getBunnyWithdrawalFeeTimes(provider, userAddress, vaultId) {
  const vault = getVault(vaultId);

  const bunnyVaultContract = new ethers.Contract(
    vault.address,
    bunnyVaultAbi,
    provider,
  );

  const userProxyContractAddress = getUserProxyContractAddress(
    provider,
    userAddress,
  );
  const depositedAt = await bunnyVaultContract.depositedAt(
    userProxyContractAddress,
  );
  const currentTimestamp = (await provider.getBlock("latest")).timestamp;

  // Assuming bunny minter address from config (technically it can be different between vaults + dynamically be changed)
  const bunnyMinterContract = new ethers.Contract(
    addresses.bunny.minter,
    bunnyMinterAbi,
    provider,
  );
  const feePeriodEnd = depositedAt.add(
    await bunnyMinterContract.WITHDRAWAL_FEE_FREE_PERIOD(),
  );

  let withdrawalFeeRemainingTime;
  if (currentTimestamp > feePeriodEnd) {
    withdrawalFeeRemainingTime = BigNumber.from(0);
  } else {
    withdrawalFeeRemainingTime = feePeriodEnd.sub(currentTimestamp);
  }

  return {
    withdrawalFeeRemainingTime,
    depositedAt,
  };
}

async function getBunnyWithdrawFeeAndRemainingTime(
  provider,
  userAddress,
  vaultId,
  amount,
) {
  const { withdrawalFeeRemainingTime, depositedAt } =
    await getBunnyWithdrawalFeeTimes(provider, userAddress, vaultId);

  let withdrawalFee;
  if (withdrawalFeeRemainingTime.eq(0)) {
    withdrawalFee = BigNumber.from(0);
  } else {
    // Assuming bunny minter address from config (technically it can be different between vaults + dynamically be changed)
    const bunnyMinterContract = new ethers.Contract(
      addresses.bunny.minter,
      bunnyMinterAbi,
      provider,
    );

    withdrawalFee = await bunnyMinterContract.withdrawalFee(
      amount,
      depositedAt,
    );
  }

  return { withdrawalFee, withdrawalFeeRemainingTime };
}

// Beefy

async function getBeefyWithdrawFeeParams(provider, vaultId) {
  const vault = getVault(vaultId);

  const beefyVaultContract = new ethers.Contract(
    vault.address,
    beefyVaultAbi,
    provider,
  );
  const strategyAddress = await beefyVaultContract.strategy();

  let strategyContract, withdrawalFeeFactor;
  if (vault.additionalData.strategyType == "venusBNBV2") {
    strategyContract = new ethers.Contract(
      strategyAddress,
      beefyStrategyVenusBNBV2,
      provider,
    );
    withdrawalFeeFactor = await strategyContract.WITHDRAWAL_FEE();
  } else if (vault.additionalData.strategyType == "cakeV2") {
    strategyContract = new ethers.Contract(
      strategyAddress,
      beefyStrategyCakeV2,
      provider,
    );
    withdrawalFeeFactor = await strategyContract.withdrawalFee();
  } else if (vault.additionalData.strategyType == "cakeLP") {
    strategyContract = new ethers.Contract(
      strategyAddress,
      beefyStrategyCakeLP,
      provider,
    );
    withdrawalFeeFactor = await strategyContract.WITHDRAWAL_FEE();
  } else if (vault.additionalData.strategyType == "commonChefLP") {
    strategyContract = new ethers.Contract(
      strategyAddress,
      beefyStrategyCommonChefLP,
      provider,
    );
    withdrawalFeeFactor = await strategyContract.withdrawalFee();
  } else if (
    vault.additionalData.strategyType == "cakeLP-dynamicWithdrawalFee"
  ) {
    strategyContract = new ethers.Contract(
      strategyAddress,
      beefyStrategyCakeLPDynamic,
      provider,
    );
    withdrawalFeeFactor = await strategyContract.withdrawalFee();
  }

  const withdrawalFeeMax = await strategyContract.WITHDRAWAL_MAX();
  return { withdrawalFeeFactor, withdrawalFeeMax };
}

async function getBeefyWithdrawFee(provider, vaultId, amount) {
  const { withdrawalFeeFactor, withdrawalFeeMax } =
    await getBeefyWithdrawFeeParams(provider, vaultId);
  return BigNumber.from(amount).mul(withdrawalFeeFactor).div(withdrawalFeeMax);
}

// Autofarm

async function getAutofarmDepositFeeParams(provider, vaultId) {
  const vault = getVault(vaultId);

  const autofarmVaultContract = new ethers.Contract(
    vault.address,
    autofarmVaultAbi,
    provider,
  );
  const poolInfo = await autofarmVaultContract.poolInfo(
    vault.additionalData.pid,
  );
  if (!poolInfo)
    throw new Error(`AutoFarm pool not found: pid ${vault.additionalData.pid}`);

  let strategyContract;
  if (vault.additionalData.strategyType == "stratX") {
    strategyContract = new ethers.Contract(
      poolInfo.strat,
      autofarmStratXAbi,
      provider,
    );
  } else if (vault.additionalData.strategyType == "stratX2PCS") {
    strategyContract = new ethers.Contract(
      poolInfo.strat,
      autofarmStratX2PCSAbi,
      provider,
    );
  }

  const entranceFeeFactorMax = await strategyContract.entranceFeeFactorMax();
  // autofarm entranceFeeFactor is not how much fee to take but how many shares to mint
  const entranceFeeFactor = entranceFeeFactorMax.sub(
    await strategyContract.entranceFeeFactor(),
  );

  return { entranceFeeFactor, entranceFeeFactorMax };
}

async function getAutofarmDepositFee(provider, vaultId, amount) {
  const { entranceFeeFactor, entranceFeeFactorMax } =
    await getAutofarmDepositFeeParams(provider, vaultId);
  return BigNumber.from(amount)
    .mul(entranceFeeFactor)
    .div(entranceFeeFactorMax);
}

async function getVaultFees(provider, vaultId, userAddress) {
  const vault = getVault(vaultId);

  let withdrawalFeePercentage, depositFeePercentage;
  if (vault.vaultProvider === "bunny") {
    const { withdrawalFeeRemainingTime, depositedAt } =
      await getBunnyWithdrawalFeeTimes(provider, userAddress, vaultId);
    if (userAddress && withdrawalFeeRemainingTime.eq(0) && !depositedAt.eq(0)) {
      withdrawalFeePercentage = "0.00";
    } else {
      const { withdrawalFeeFactor, withdrawalFeeMax } =
        await getBunnyWithdrawFeeParams(provider);
      withdrawalFeePercentage = (
        (withdrawalFeeFactor.toNumber() / withdrawalFeeMax.toNumber()) *
        100
      ).toFixed(2);
    }
    depositFeePercentage = "0.00";
  } else if (vault.vaultProvider === "beefy") {
    const { withdrawalFeeFactor, withdrawalFeeMax } =
      await getBeefyWithdrawFeeParams(provider, vaultId);
    withdrawalFeePercentage = (
      (withdrawalFeeFactor.toNumber() / withdrawalFeeMax.toNumber()) *
      100
    ).toFixed(2);
    depositFeePercentage = "0.00";
  } else if (vault.vaultProvider === "autofarm") {
    const { entranceFeeFactor, entranceFeeFactorMax } =
      await getAutofarmDepositFeeParams(provider, vaultId);
    withdrawalFeePercentage = "0.00";
    depositFeePercentage = (
      (entranceFeeFactor.toNumber() / entranceFeeFactorMax.toNumber()) *
      100
    ).toFixed(2);
  }

  return { withdrawalFeePercentage, depositFeePercentage };
}

async function getRebalanceCosts(
  provider,
  fromVaultId,
  toVaultId,
  userAddress,
) {
  // gas cost
  const rebalanceTxData = await rebalanceAll(fromVaultId, toVaultId);
  const rebalanceTx = {
    to: addresses.revault,
    from: userAddress,
    data: rebalanceTxData,
  };
  const txGas = await getGasLimit(
    provider,
    rebalanceTx,
    systemConfig.gasEstimationMultiplier,
  );
  const gasPrice = await getGasPrice(provider, true);
  const gasCostEth = gasPrice.mul(txGas);

  const fromVault = getVault(fromVaultId);
  const toVault = getVault(toVaultId);
  const token = getTokenByAddress(fromVault.depositTokenAddress);

  const userVaultPrincipal = await getUserVaultPrincipal(
    provider,
    fromVault.additionalData.vid,
    userAddress,
  );

  // withdrawal fee
  let withdrawalFeeToken = BigNumber.from(0);
  if (fromVault.vaultProvider == "bunny") {
    withdrawalFeeToken = (
      await getBunnyWithdrawFeeAndRemainingTime(
        provider,
        userAddress,
        fromVaultId,
        userVaultPrincipal,
      )
    ).withdrawalFee;
  } else if (fromVault.vaultProvider == "beefy") {
    withdrawalFeeToken = await getBeefyWithdrawFee(
      provider,
      fromVaultId,
      userVaultPrincipal,
    );
  }

  // deposit fee
  let depositFeeToken = BigNumber.from(0);
  if (toVault.vaultProvider == "autofarm") {
    depositFeeToken = await getAutofarmDepositFee(
      provider,
      toVaultId,
      userVaultPrincipal,
    );
  }

  // convert to USD
  const precision = 2;
  const bnbToken = getToken("bnb");
  const bnbBusdRate = await getTokenToBusdRate(provider, bnbToken.tokenId);
  const tokenBusdRate = await getTokenToBusdRate(provider, token.tokenId);

  const gasCostUsd =
    parseFloat(ethers.utils.formatUnits(gasCostEth, bnbToken.decimals)) *
    bnbBusdRate;
  const withdrawalFeeUsd =
    parseFloat(ethers.utils.formatUnits(withdrawalFeeToken, token.decimals)) *
    tokenBusdRate;
  const depositFeeUsd =
    parseFloat(ethers.utils.formatUnits(depositFeeToken, token.decimals)) *
    tokenBusdRate;

  const totalCostUsd = gasCostUsd + withdrawalFeeUsd + depositFeeUsd;

  return {
    totalCostUsd: parseFloat(totalCostUsd.toFixed(precision)),
    txGas: txGas,
    gasPrice: parseFloat(ethers.utils.formatEther(gasPrice)),
    gasCostUsd: parseFloat(gasCostUsd.toFixed(precision)),
    withdrawalFeeUsd: parseFloat(withdrawalFeeUsd.toFixed(precision)),
    depositFeeUsd: parseFloat(depositFeeUsd.toFixed(precision)),
  };
}

async function getRebalanceDailyGainEstimation(
  provider,
  fromVaultId,
  toVaultId,
  userAddress,
) {
  const fromVault = getVault(fromVaultId);
  const token = getTokenByAddress(fromVault.depositTokenAddress);

  const userVaultPrincipal = await getUserVaultPrincipal(
    provider,
    fromVault.additionalData.vid,
    userAddress,
  );

  const zapContract = new ethers.Contract(addresses.zap, zapAbi, provider);
  const tokenToBusdRate = await zapContract.getBUSDValue(
    token.address,
    BigNumber.from("10").pow(token.decimals),
  );
  const principalBalanceBusd = tokenToBusdRate
    .mul(userVaultPrincipal)
    .div(BigNumber.from("10").pow(token.decimals));

  const fromApy = await getApy(fromVaultId);
  const toApy = await getApy(toVaultId);
  const apyDiff = toApy - fromApy;
  const dailyGain =
    (parseFloat(format(principalBalanceBusd)) * apyDiff) / 100 / 365;

  return dailyGain;
}

async function getRebalanceBreakEvenPeriod(
  provider,
  fromVaultId,
  toVaultId,
  userAddress,
) {
  const rebalanceCostUsd = (
    await getRebalanceCosts(provider, fromVaultId, toVaultId, userAddress)
  ).totalCostUsd;
  const dailyGainUsd = await getRebalanceDailyGainEstimation(
    provider,
    fromVaultId,
    toVaultId,
    userAddress,
  );

  // negative gains - will never break even
  if (dailyGainUsd <= 0) {
    return {};
  }

  const daysToBreakEvenFloat = rebalanceCostUsd / dailyGainUsd;
  return {
    days: Math.floor(daysToBreakEvenFloat),
    hours: Math.floor((daysToBreakEvenFloat % 1) * 24),
    minutes: Math.floor((((daysToBreakEvenFloat % 1) * 24) % 1) * 60),
  };
}

export {
  getBunnyWithdrawFeeAndRemainingTime,
  getBeefyWithdrawFeeParams,
  getBeefyWithdrawFee,
  getAutofarmDepositFeeParams,
  getAutofarmDepositFee,
  getVaultFees,
  getRebalanceCosts,
  getRebalanceDailyGainEstimation,
  getRebalanceBreakEvenPeriod,
};
