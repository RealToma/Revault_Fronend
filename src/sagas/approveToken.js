// TODO: move to api layer (folder)
import { RevaApi } from "../apis";
import { config } from "../config/config";

const GEM = config.getSystemConfig().gasEstimationMultiplier;

export async function hasUserApprovedToken({
  tokenAddress,
  userAddress = window.ethereum.selectedAddress,
  targetAddress,
}) {
  const revaApi = RevaApi();
  const hasUserApproved = await revaApi.hasApprovedInfinity(
    tokenAddress,
    userAddress,
    targetAddress,
  );

  return hasUserApproved;
}

export async function approveToken({
  tokenAddress,
  targetAddress,
  userAddress = window.ethereum.selectedAddress,
  value = "0x00",
}) {
  try {
    const revaApi = RevaApi();

    const data = await revaApi.generateApproveInfinityData(
      tokenAddress,
      targetAddress,
    );

    const gasPrice = await revaApi.getGasPrice();
    const txParams = {
      to: tokenAddress,
      from: userAddress,
      gasPrice,
      value,
      data,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    const approveTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    return { tokenAddress, targetAddress, txHash: approveTxHash };
  } catch (error) {
    console.log(error.stack);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function verifyAndApproveToken({ tokenAddress, targetAddress }) {
  const isTokenApproved = await hasUserApprovedToken({
    tokenAddress,
    targetAddress,
  });
  if (!isTokenApproved) {
    await approveToken({
      tokenAddress,
      targetAddress,
    });
  }
}
