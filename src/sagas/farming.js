import { RevaApi } from "../apis";
import { activateErrorNotification } from "../components/TransactionNotification/TransactionNotification";
import { config } from "../config/config";
import { stringToBigNumber } from "../helpers/utils";
const addresses = config.getNetworkAddresses();
const GEM = config.getSystemConfig().gasEstimationMultiplier;

export async function fetchLiquidityRatio({
  firstTokenSymbol,
  secondTokenSymbol,
  amount,
  precision,
}) {
  try {
    const revaApi = RevaApi();
    const data = await revaApi.getLiquidityRatio(
      firstTokenSymbol,
      secondTokenSymbol,
      amount,
      precision,
    );

    return data;
  } catch (error) {
    console.log(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function fetchRevaLPBalance({ userAddress }) {
  try {
    const revaApi = RevaApi();
    const data = await revaApi.getUserRevaBnbBalance(userAddress);

    return stringToBigNumber(data);
  } catch (error) {
    console.log(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function fetchUserRevaLpStakingPoolPositions({ userAddress }) {
  try {
    if (!userAddress) {
      return undefined;
    }
    const revaApi = RevaApi();
    const data = await revaApi.getAllUserRevaLpStakingPoolPositions(
      userAddress,
    );
    const userPositions = data.map((userPosition) => {
      return {
        ...userPosition,
        lpStaked: stringToBigNumber(userPosition.lpStaked),
        pendingReva: stringToBigNumber(userPosition.pendingReva),
        revaEarned: stringToBigNumber(userPosition.revaEarned),
      };
    });

    return userPositions;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function withdrawRevaLP({ poolId, amount }) {
  try {
    const { revaLpStakingPool } = addresses;

    const revaApi = RevaApi();
    const gasPrice = await revaApi.getGasPrice();
    const txData = await revaApi.unstakeRevaLp(poolId, amount);

    // Metamask request logic (approve and sign tx)
    const txParams = {
      to: revaLpStakingPool,
      from: window.ethereum.selectedAddress,
      value: "0x00",
      data: txData,
      gasPrice,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    const unstakeRevaLPTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    return unstakeRevaLPTxHash;
  } catch (error) {
    activateErrorNotification(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function depositRevaLP({ poolId, amount }) {
  try {
    const { revaLpStakingPool } = addresses;

    const revaApi = RevaApi();
    const gasPrice = await revaApi.getGasPrice();

    const txData = await revaApi.stakeRevaLp(poolId, amount);

    // Metamask request logic (approve and sign tx)
    const txParams = {
      to: revaLpStakingPool,
      from: window.ethereum.selectedAddress,
      value: "0x00",
      data: txData,
      gasPrice,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    const stakeRevaLPTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    return stakeRevaLPTxHash;
  } catch (error) {
    activateErrorNotification(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function fetchRevaLPStakingPools() {
  try {
    const revaApi = RevaApi();
    const data = await revaApi.getRevaLpStakingPools();

    return data;
  } catch (error) {
    console.log(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function claimRevaLP({ poolId }) {
  try {
    const { revaLpStakingPool } = addresses;

    const revaApi = RevaApi();
    const gasPrice = await revaApi.getGasPrice();
    const txData = await revaApi.claimRevaLpStakeReward(poolId);

    // Metamask request logic (approve and sign tx)
    const txParams = {
      to: revaLpStakingPool,
      from: window.ethereum.selectedAddress,
      value: "0x00",
      data: txData,
      gasPrice,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    const claimRevaLPTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    return claimRevaLPTxHash;
  } catch (error) {
    console.log(error);
    activateErrorNotification(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}
