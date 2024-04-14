const ethers = require("ethers");

const { config } = require("../../config/config");

const { getTokenByAddress, getVault } = require("../utils/addresses");

const bunnyAbi = require("../../abi/IBunnyVault.json");
const beefyAbi = require("../../abi/IBeefyVault.json");
const autofarmAbi = require("../../abi/IAutoFarm.json");

const MAX_UINT =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const provider = new ethers.providers.StaticJsonRpcProvider(
  config.getProviderUrl(),
);

// rebalance all, in future regular rebalance as well
async function generateRebalanceAllPayloads(fromVaultId, toVaultId) {
  const toVault = getVault(toVaultId);

  const withdrawAllPayload = await generateWithdrawAllPayload(fromVaultId);
  let payloads = [withdrawAllPayload];

  if (toVault.vaultProvider === "bunny") {
    const bunnyVaultContract = new ethers.Contract(toVault.address, bunnyAbi);
    let depositPayload;
    // Bunny's BNB vault requires BNB as deposit
    if (toVault.depositTokenSymbol === "bnb") {
      depositPayload =
        await bunnyVaultContract.populateTransaction.depositBNB();
    } else {
      depositPayload =
        await bunnyVaultContract.populateTransaction.depositAll();
    }
    payloads.push(depositPayload.data);
  } else if (toVault.vaultProvider === "beefy") {
    const beefyVaultContract = new ethers.Contract(toVault.address, beefyAbi);
    let depositAllPayload;
    if (toVault.depositTokenSymbol === "bnb") {
      depositAllPayload =
        await beefyVaultContract.populateTransaction.depositBNB();
    } else {
      depositAllPayload =
        await beefyVaultContract.populateTransaction.depositAll();
    }
    payloads.push(depositAllPayload.data);
  } else if (toVault.vaultProvider === "autofarm") {
    // in case of autofarm, we need to provide _withdrawPayload, _depositLeft, _depositRight
    const autofarmVaultContract = new ethers.Contract(
      toVault.address,
      autofarmAbi,
    );
    const depositPayload =
      await autofarmVaultContract.populateTransaction.deposit(
        toVault.additionalData.pid,
        0,
      );
    const depositLeftPayload = depositPayload.data.substring(
      0,
      depositPayload.data.length - 64,
    );
    const depositRightPayload = "0x";
    payloads.push(depositLeftPayload);
    payloads.push(depositRightPayload);
  } else {
    throw new Error(`unrecognized provider ${toVault.vaultProvider}`);
  }
  return payloads;
}

async function generateWithdrawPayload(vaultId, amountTokens) {
  const vault = getVault(vaultId);
  const token = getTokenByAddress(vault.depositTokenAddress);

  if (vault.vaultProvider === "bunny") {
    const bunnyVaultContract = new ethers.Contract(vault.address, bunnyAbi);
    let txData;
    if (token.isFlip) {
      txData = await bunnyVaultContract.populateTransaction.withdrawUnderlying(
        amountTokens,
      );
    } else {
      // venus vaults require withdrawUnderlying
      txData = await bunnyVaultContract.populateTransaction.withdrawUnderlying(
        amountTokens,
      );
    }
    return txData.data;
  } else if (vault.vaultProvider === "beefy") {
    const beefyVaultContract = new ethers.Contract(
      vault.address,
      beefyAbi,
      provider,
    );
    let amountShares = await beefyConvertTokensToShares(
      beefyVaultContract,
      amountTokens,
    );
    let txData;
    if (vault.depositTokenSymbol === "bnb") {
      txData = await beefyVaultContract.populateTransaction.withdrawBNB(
        amountShares,
      );
    } else {
      txData = await beefyVaultContract.populateTransaction.withdraw(
        amountShares,
      );
    }
    return txData.data;
  } else if (vault.vaultProvider === "autofarm") {
    const autofarmVaultContract = new ethers.Contract(
      vault.address,
      autofarmAbi,
    );
    const txData = await autofarmVaultContract.populateTransaction.withdraw(
      vault.additionalData.pid,
      amountTokens,
    );
    return txData.data;
  } else {
    throw new Error(`unrecognized provider ${vault.vaultProvider}`);
  }
}

async function generateWithdrawAllPayload(vaultId) {
  const vault = getVault(vaultId);
  if (vault.vaultProvider === "bunny") {
    const bunnyVaultContract = new ethers.Contract(vault.address, bunnyAbi);
    const txData = await bunnyVaultContract.populateTransaction.withdrawAll();
    return txData.data;
  } else if (vault.vaultProvider === "beefy") {
    const beefyVaultContract = new ethers.Contract(vault.address, beefyAbi);
    let txData;
    if (vault.depositTokenSymbol === "bnb") {
      txData = await beefyVaultContract.populateTransaction.withdrawAllBNB();
    } else {
      txData = await beefyVaultContract.populateTransaction.withdrawAll();
    }
    return txData.data;
  } else if (vault.vaultProvider === "autofarm") {
    const autofarmVaultContract = new ethers.Contract(
      vault.address,
      autofarmAbi,
    );
    const txData = await autofarmVaultContract.populateTransaction.withdraw(
      vault.additionalData.pid,
      MAX_UINT,
    );
    return txData.data;
  } else {
    throw new Error(`unrecognized provider ${vault.vaultProvider}`);
  }
}

async function generateDepositPayload(vaultId, amountTokens) {
  const vault = getVault(vaultId);
  if (vault.vaultProvider === "bunny") {
    const bunnyVaultContract = new ethers.Contract(vault.address, bunnyAbi);
    let txData;
    if (vault.depositTokenSymbol === "bnb") {
      txData = await bunnyVaultContract.populateTransaction.depositBNB();
    } else {
      txData = await bunnyVaultContract.populateTransaction.deposit(
        amountTokens,
      );
    }
    return txData.data;
  } else if (vault.vaultProvider === "beefy") {
    const beefyVaultContract = new ethers.Contract(vault.address, beefyAbi);
    let txData;
    if (vault.depositTokenSymbol === "bnb") {
      txData = await beefyVaultContract.populateTransaction.depositBNB();
    } else {
      txData = await beefyVaultContract.populateTransaction.deposit(
        amountTokens,
      );
    }
    return txData.data;
  } else if (vault.vaultProvider === "autofarm") {
    const autofarmVaultContract = new ethers.Contract(
      vault.address,
      autofarmAbi,
    );
    const txData = await autofarmVaultContract.populateTransaction.deposit(
      vault.additionalData.pid,
      amountTokens,
    );
    return txData.data;
  } else {
    throw new Error(`unrecognized provider ${vault.vaultProvider}`);
  }
}

// TODO
async function generateHarvestPayload(vaultId) {
  const vault = getVault(vaultId);
  if (vault.vaultProvider === "bunny") {
    const bunnyVaultContract = new ethers.Contract(vault.address, bunnyAbi);
    const txData = await bunnyVaultContract.populateTransaction.getReward();
    return txData.data;
  } else if (vault.vaultProvider === "beefy") {
    throw new Error("Can't harvest beefy");
  } else if (vault.vaultProvider === "autofarm") {
    const autofarmVaultContract = new ethers.Contract(
      vault.address,
      autofarmAbi,
    );
    const txData = await autofarmVaultContract.populateTransaction.deposit(
      vault.additionalData.pid,
      0,
    );
    return txData.data;
  }
  throw new Error(`unrecognized provider ${vault.vaultProvider}`);
}

async function beefyConvertTokensToShares(beefyVaultContract, tokenAmount) {
  const vaultTotalShares = await beefyVaultContract.totalSupply();
  const vaultTotalTokens = await beefyVaultContract.balance();
  const shareAmount = vaultTotalShares.mul(tokenAmount).div(vaultTotalTokens);
  return shareAmount;
}

export {
  generateDepositPayload,
  generateWithdrawPayload,
  generateWithdrawAllPayload,
  generateRebalanceAllPayloads,
  generateHarvestPayload,
  beefyConvertTokensToShares,
};
