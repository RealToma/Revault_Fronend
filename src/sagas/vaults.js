import { RevaApi } from "../apis";
import { config } from "../config/config";
import { getVault } from "../apis/utils/addresses";
import { activateErrorNotification } from "../components/TransactionNotification/TransactionNotification";

const addresses = config.getNetworkAddresses();
const GEM = config.getSystemConfig().gasEstimationMultiplier;

export async function deposit({ vaultId, amount }) {
  try {
    const revaApi = RevaApi();

    const gasPrice = await revaApi.getGasPrice();
    const txData = await revaApi.generateDepositData(vaultId, amount);
    const txParams = {
      to: txData.address,
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: txData.data,
      value: txData.value,
      gasPrice,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    console.log("performing deposit");

    const depositTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    return depositTxHash;
  } catch (error) {
    console.log(error.stack);
    activateErrorNotification(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function zapAndDeposit({ fromTokenId, toVaultId, amount }) {
  try {
    const revaApi = RevaApi();

    const gasPrice = await revaApi.getGasPrice();
    let txParams;

    const txData = await revaApi.generateZapAndDepositData(
      fromTokenId,
      toVaultId,
      amount,
    );
    const value = txData.value ? txData.value.toHexString() : "0x00";
    txParams = {
      to: addresses.zapAndDeposit,
      from: window.ethereum.selectedAddress, // must match user's active address.
      gasPrice,
      data: txData.data,
      value,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    const zapAndDepositTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    return zapAndDepositTxHash;
  } catch (error) {
    console.log(error.stack);
    activateErrorNotification(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function withdraw({ fromVaultId, amount }) {
  try {
    // TODO: add endpoint from metamask
    const revaApi = RevaApi();

    const txData = await revaApi.generateWithdrawData(fromVaultId, amount);
    const gasPrice = await revaApi.getGasPrice();
    const txParams = {
      to: addresses.revault,
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: txData,
      value: "0x00",
      gasPrice,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    console.log("performing withdraw");

    const withdrawTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    return withdrawTxHash;
  } catch (error) {
    console.log(error.stack);
    activateErrorNotification(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function withdrawAll({ fromVaultId }) {
  try {
    // TODO: add endpoint from metamask
    const revaApi = RevaApi();

    const txData = await revaApi.generateWithdrawAllData(fromVaultId);
    const gasPrice = await revaApi.getGasPrice();
    const txParams = {
      to: addresses.revault,
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: txData,
      value: "0x00",
      gasPrice,
    };

    console.log("performing withdraw all");

    const withdrawTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    return withdrawTxHash;
  } catch (error) {
    console.log(error.stack);
    activateErrorNotification(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

// TODO: this should be called RebalanceAll, in the future we want RebalanceAmount
export async function rebalance({ fromVaultId, toVaultId, txGas }) {
  try {
    const revaApi = RevaApi();

    const txData = await revaApi.generateRebalanceAllData(
      fromVaultId,
      toVaultId,
    );
    const gasPrice = await revaApi.getGasPrice();
    const txParams = {
      to: addresses.revault,
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: txData,
      value: "0x00",
      gas: txGas.toString(16), // hex value
      gasPrice,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    console.log("performing rebalance all");

    const rebalanceAllTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    console.log("Handle Rebalance with payload:", { fromVaultId, toVaultId });

    return rebalanceAllTxHash;
  } catch (error) {
    console.log(error.stack);
    activateErrorNotification(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function claim({ vaultId }) {
  try {
    const revaApi = RevaApi();
    let to;

    const txData = await revaApi.generateClaimData(vaultId);
    const vault = getVault(vaultId);
    if (vault.vaultProvider === "beefy") {
      to = addresses.revaChef;
    } else {
      to = addresses.revault;
    }
    const gasPrice = await revaApi.getGasPrice();
    const txParams = {
      to,
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: txData,
      value: "0x00",
      gasPrice,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    const vaultClaimTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    console.log("Handle Claim with payload:", { vaultId });

    return vaultClaimTxHash;
  } catch (error) {
    activateErrorNotification(error);
    console.log(error.stack);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function fees({ vaultId }) {
  try {
    const revaApi = RevaApi();
    const feeData = await revaApi.getVaultFees(
      vaultId,
      window.ethereum.selectedAddress,
    );

    return feeData;
  } catch (error) {
    console.log("feesMutation no vault found", error.stack);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}
