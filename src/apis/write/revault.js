const { ethers } = require("ethers");

const addresses = require("../../config/config").config.getNetworkAddresses();

const { getToken, getVault } = require("../utils/addresses");

const revaultAbi = require("../../abi/ReVault.json");

const revaultAddress = addresses.revault;

const {
  generateDepositPayload,
  generateWithdrawAllPayload,
  generateRebalanceAllPayloads,
  generateWithdrawPayload,
  generateHarvestPayload,
} = require("../utils/payloads");
const { claim } = require("./revachef");

async function rebalanceAll(fromVaultId, toVaultId) {
  const toVault = getVault(toVaultId);

  const revaultContract = new ethers.Contract(revaultAddress, revaultAbi);

  let data;
  if (toVault.vaultProvider === "autofarm") {
    const [withdrawAllPayload, depositLeftPayload, depositRightPayload] =
      await generateRebalanceAllPayloads(fromVaultId, toVaultId);
    const txData =
      await revaultContract.populateTransaction.rebalanceDepositAllDynamicAmount(
        fromVaultId,
        toVaultId,
        withdrawAllPayload,
        depositLeftPayload,
        depositRightPayload,
      );
    data = txData.data;
  } else {
    const [withdrawAllPayload, depositAllPayload] =
      await generateRebalanceAllPayloads(fromVaultId, toVaultId);
    const txData =
      await revaultContract.populateTransaction.rebalanceDepositAll(
        fromVaultId,
        toVaultId,
        withdrawAllPayload,
        depositAllPayload,
      );
    data = txData.data;
  }
  return data;
}

async function deposit(provider, vaultId, amount) {
  const vault = getVault(vaultId);
  const token = getToken(vault.depositTokenSymbol);

  const revaultContract = new ethers.Contract(revaultAddress, revaultAbi);

  const formattedAmount = ethers.utils.parseUnits(
    String(amount),
    token.decimals,
  );

  let value = "0x00";
  const depositPayload = await generateDepositPayload(vaultId, formattedAmount);
  const toAddress = revaultAddress;

  const txData = await revaultContract.populateTransaction.depositToVault(
    formattedAmount,
    vaultId,
    depositPayload,
  );

  // for bnb
  if (vault.depositTokenSymbol === "bnb") {
    value = formattedAmount.toHexString();
  }
  return { address: toAddress, data: txData.data, value: value };
}

async function withdraw(vaultId, amount) {
  const vault = getVault(vaultId);
  const token = getToken(vault.depositTokenSymbol);

  const revaultContract = new ethers.Contract(revaultAddress, revaultAbi);

  const formattedAmount = ethers.utils.parseUnits(
    String(amount),
    token.decimals,
  );
  const withdrawPayload = await generateWithdrawPayload(
    vaultId,
    formattedAmount,
  );

  const txData = await revaultContract.populateTransaction.withdrawFromVault(
    vaultId,
    withdrawPayload,
  );
  return txData.data;
}

async function withdrawAll(vaultId) {
  const revaultContract = new ethers.Contract(revaultAddress, revaultAbi);
  const withdrawAllPayload = await generateWithdrawAllPayload(vaultId);

  const txData = await revaultContract.populateTransaction.withdrawFromVault(
    vaultId,
    withdrawAllPayload,
  );
  return txData.data;
}

async function harvest(vaultId) {
  const vault = getVault(vaultId);

  // beefy doesn't have harvest, so we claim reva from revachef
  if (vault.vaultProvider === "beefy") {
    const token = getToken(vault.depositTokenSymbol);
    return claim(token.tokenId);
  }
  const revaultContract = new ethers.Contract(revaultAddress, revaultAbi);
  const harvestPayload = await generateHarvestPayload(vaultId);

  const txData = await revaultContract.populateTransaction.harvestVault(
    vaultId,
    harvestPayload,
  );
  return txData.data;
}

export { deposit, withdraw, withdrawAll, rebalanceAll, harvest };
