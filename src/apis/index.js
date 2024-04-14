const { ethers } = require("ethers");

const { config } = require("../config/config");
const addresses = config.getNetworkAddresses();

const { getToken } = require("./utils/addresses");
const { getRevaStats, getCirculatingSupply } = require("./read/revaStats");
const {
  getAllPositions,
  getAllUserPositions,
  getUserPositions,
} = require("./read/positions");
const { getAllApys } = require("./read/apy");
const { getGasPrice, estimateGas, getGasLimit } = require("./read/network");
const { getLiquidityRatio } = require("./read/lp");
const {
  getAllTokenToBusdRates,
  getUserBalances,
  getUserBalanceByTokenAddress,
  hasUserApprovedInfinity,
  getTokenToBusdRate,
} = require("./read/tokens");
const {
  getPercentageOfProfitsConvertedToReva,
  getPercentageOfProfitsDistributedToStakers,
} = require("./read/revault");
const {
  getVaultFees,
  getRebalanceCosts,
  getRebalanceDailyGainEstimation,
  getRebalanceBreakEvenPeriod,
} = require("./read/vaults");
const {
  deposit,
  withdraw,
  withdrawAll,
  rebalanceAll,
  harvest,
} = require("./write/revault");
const { zap, zapAndDeposit } = require("./write/zap");
const { generateApproveInfinityData } = require("./write/tokens");
const {
  stakeReva,
  stakeRevaLp,
  unstakeReva,
  unstakeRevaLp,
  unstakeRevaEarly,
  claimRevaReward,
  claimRevaLpReward,
} = require("./write/staking");
const {
  getRevaStakingPools,
  getRevaLpStakingPools,
  getAllUserRevaStakingPoolPositions,
  getAllUserRevaLpStakingPoolPositions,
} = require("./read/staking");

function RevaApi() {
  const provider = new ethers.providers.StaticJsonRpcProvider(
    config.getProviderUrl(),
  );

  if (!(this instanceof RevaApi)) {
    return new RevaApi();
  }

  // stats at the bottom of the page. same for all users (can be cached?)
  RevaApi.prototype.stats = function () {
    return getRevaStats(provider);
  };

  RevaApi.prototype.getCirculatingSupply = function () {
    return getCirculatingSupply(provider);
  };

  // returns an array of all pairs we support.
  // this is static details the same for all users, can be cached, etc.
  // order of vaults is not guaranteed (i.e., not ranked based on APY)
  // TODO: vaultID can be Autofarm, etc. Is it confusing? it's more a vault "provider" rather than an
  // actual vault
  RevaApi.prototype.getAllPositions = function () {
    return getAllPositions(provider);
  };

  // get a connected user position within our pairs. for each pair the user has a position in, receive
  // the selected vault and position
  RevaApi.prototype.getAllUserPositions = async function (accountAddress) {
    return getAllUserPositions(provider, accountAddress);
  };

  RevaApi.prototype.getUserPositions = async function (
    accountAddress,
    tokenId,
  ) {
    return getUserPositions(provider, accountAddress, tokenId);
  };

  RevaApi.prototype.getAllApys = async function () {
    return getAllApys();
  };

  // all tokens appearing when zapping
  // TODO: should also contain LP tokens to be displayed as stats? how we differentiate between
  // regular tokens and LP?
  RevaApi.prototype.tokenRates = async function () {
    return getAllTokenToBusdRates(provider);
  };

  RevaApi.prototype.userTokenBalances = async function (accountAddress) {
    return getUserBalances(provider, accountAddress);
  };

  RevaApi.prototype.getUserRevaBalance = async function (userAddress) {
    return getUserBalanceByTokenAddress(
      provider,
      userAddress,
      addresses.revaToken,
      18,
    );
  };

  RevaApi.prototype.getUserRevaBnbBalance = async function (userAddress) {
    return getUserBalanceByTokenAddress(
      provider,
      userAddress,
      addresses["reva-bnb"],
      18,
    );
  };

  RevaApi.prototype.getUserRevaBusdBalance = async function (userAddress) {
    return getUserBalanceByTokenAddress(
      provider,
      userAddress,
      addresses["reva-busd"],
      18,
    );
  };

  RevaApi.prototype.generateDepositData = async function (vaultId, amount) {
    return deposit(provider, vaultId, amount);
  };

  RevaApi.prototype.generateWithdrawData = async function (vaultId, amount) {
    return withdraw(vaultId, amount);
  };

  RevaApi.prototype.generateWithdrawAllData = async function (vaultId) {
    return withdrawAll(vaultId);
  };

  RevaApi.prototype.generateRebalanceAllData = async function (
    fromVaultId,
    toVaultId,
  ) {
    return rebalanceAll(fromVaultId, toVaultId);
  };

  RevaApi.prototype.generateClaimData = async function (vaultId) {
    return harvest(vaultId);
  };

  RevaApi.prototype.generateZapData = async function (
    fromTokenId,
    toTokenId,
    amount,
  ) {
    return zap(provider, fromTokenId, toTokenId, amount);
  };

  RevaApi.prototype.generateZapAndDepositData = async function (
    fromTokenId,
    toVaultId,
    amount,
  ) {
    return zapAndDeposit(provider, fromTokenId, toVaultId, amount);
  };

  RevaApi.prototype.hasApprovedInfinity = async function (
    tokenAddress,
    userAddress,
    toAddress,
  ) {
    return hasUserApprovedInfinity(
      provider,
      tokenAddress,
      userAddress,
      toAddress,
    );
  };

  RevaApi.prototype.generateApproveInfinityData = async function (
    tokenAddress,
    targetAddress,
  ) {
    return generateApproveInfinityData(tokenAddress, targetAddress);
  };

  RevaApi.prototype.stakeReva = async function (poolId, amount) {
    return stakeReva(poolId, amount);
  };

  RevaApi.prototype.unstakeReva = async function (poolId, amount) {
    return unstakeReva(poolId, amount);
  };

  RevaApi.prototype.unstakeRevaEarly = async function (poolId, amount) {
    return unstakeRevaEarly(poolId, amount);
  };

  RevaApi.prototype.claimRevaStakeReward = async function (poolId) {
    return claimRevaReward(poolId);
  };

  RevaApi.prototype.getRevaStakingPools = async function () {
    return getRevaStakingPools(provider);
  };

  RevaApi.prototype.getAllUserRevaStakingPoolPositions = async function (
    userAddress,
  ) {
    return getAllUserRevaStakingPoolPositions(provider, userAddress);
  };

  RevaApi.prototype.stakeRevaLp = async function (poolId, amount) {
    return stakeRevaLp(poolId, amount);
  };

  RevaApi.prototype.unstakeRevaLp = async function (poolId, amount) {
    return unstakeRevaLp(poolId, amount);
  };

  RevaApi.prototype.claimRevaLpStakeReward = async function (poolId) {
    return claimRevaLpReward(poolId);
  };

  RevaApi.prototype.getRevaLpStakingPools = async function () {
    return getRevaLpStakingPools(provider);
  };

  RevaApi.prototype.getAllUserRevaLpStakingPoolPositions = async function (
    userAddress,
  ) {
    return getAllUserRevaLpStakingPoolPositions(provider, userAddress);
  };

  RevaApi.prototype.rebalanceStats = async function (
    fromVaultId,
    toVaultId,
    userAddress,
  ) {
    const rebalanceCosts = await getRebalanceCosts(
      provider,
      fromVaultId,
      toVaultId,
      userAddress,
    );
    const rebalanceDailyGain = await getRebalanceDailyGainEstimation(
      provider,
      fromVaultId,
      toVaultId,
      userAddress,
    );
    const rebalanceBreakEvenPeriod = await getRebalanceBreakEvenPeriod(
      provider,
      fromVaultId,
      toVaultId,
      userAddress,
    );

    return {
      actionCost: rebalanceCosts.totalCostUsd,
      withdrawFee: rebalanceCosts.withdrawalFeeUsd,
      depositFee: rebalanceCosts.depositFeeUsd,
      txGas: rebalanceCosts.txGas,
      gasPrice: rebalanceCosts.gasPrice,
      gasFee: rebalanceCosts.gasCostUsd,
      gain24h: rebalanceDailyGain,
      gain7d: rebalanceDailyGain * 7,
      gain30d: rebalanceDailyGain * 30,
      timeToBreakEven: {
        days: rebalanceBreakEvenPeriod.days,
        hours: rebalanceBreakEvenPeriod.hours,
        minutes: rebalanceBreakEvenPeriod.minutes,
      },
    };
  };

  RevaApi.prototype.getGasPrice = async function (getBignumber) {
    return getGasPrice(provider, getBignumber);
  };

  RevaApi.prototype.estimateGas = async function (tx) {
    return estimateGas(provider, tx);
  };

  RevaApi.prototype.getVaultFees = async function (vaultId, userAddress) {
    return getVaultFees(provider, vaultId, userAddress);
  };

  RevaApi.prototype.getLiquidityRatio = async function (
    token0symbol,
    token1symbol,
    amount,
    precision,
  ) {
    return getLiquidityRatio(
      provider,
      getToken(token0symbol),
      getToken(token1symbol),
      amount,
      precision,
    );
  };

  RevaApi.prototype.getTokenToBusdRate = async function (tokenId) {
    return getTokenToBusdRate(provider, tokenId);
  };

  RevaApi.prototype.getGasLimit = async function (tx, multiplier = 1.0) {
    try {
      return (await getGasLimit(provider, tx, multiplier)).toString(16);
    } catch (error) {
      console.log("gas estimation fail", error);
      return undefined;
    }
  };

  RevaApi.prototype.getPlatformFees = async function () {
    return {
      platformFee: await getPercentageOfProfitsConvertedToReva(provider),
      buybackRate: await getPercentageOfProfitsDistributedToStakers(provider),
    };
  };
}

export { RevaApi };
