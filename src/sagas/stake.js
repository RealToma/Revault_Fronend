// TODO: move to api layer (folder)
import { config } from "../config/config";
import { RevaApi } from "../apis";
import { stringToBigNumber } from "../helpers/utils";
import { activateErrorNotification } from "../components/TransactionNotification/TransactionNotification";
const addresses = config.getNetworkAddresses();
const GEM = config.getSystemConfig().gasEstimationMultiplier;

// When intetgrating remove all this :)
//
// import { mockBackendCall } from "../helpers/utils";
// import axios from "axios";
//
// const RevaApiMock = function () {};
// RevaApiMock.prototype.getRevaStakingPools = () => {
//   return axios.get("https://api.npoint.io/f7f3e43974aa925a76c0");
// };
// RevaApiMock.prototype.getAllUserRevaStakingPoolPositions = () => {
//   return axios.get("https://api.npoint.io/9e3f5819eba2123ca42d");
// };

// RevaApiMock.prototype.stake = () => mockBackendCall(true, 2500);
// RevaApiMock.prototype.unstake = () => mockBackendCall(true, 2500);
// RevaApiMock.prototype.claimRevaStakeReward = () => mockBackendCall(true, 2500);

// RevaApiMock.prototype.getRevaLpStakingPools = () => {
//   return axios.get("https://api.npoint.io/3756b253fcdf0766d8bf");
// };

// RevaApiMock.prototype.stakeRevaLp = () => mockBackendCall(true, 2500);
// RevaApiMock.prototype.unstakeRevaLP = () => mockBackendCall(true, 2500);
// RevaApiMock.prototype.claimRevaStakeReward = () => mockBackendCall(true, 2500);

// const revaApiMock = new RevaApiMock();
// const RevaApi = () => {
//   return revaApiMock;
// };

export async function fetchRevaStakingPools() {
  try {
    const revaApi = RevaApi();
    const data = await revaApi.getRevaStakingPools();

    return data;
  } catch (error) {
    console.log(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

export async function fetchUserRevaStakingPoolPositions({ userAddress }) {
  try {
    if (!userAddress) {
      return undefined;
    }
    const revaApi = RevaApi();
    let data = await revaApi.getAllUserRevaStakingPoolPositions(userAddress);
    // Converting to big, this should move to state management
    const userPositions = data.map((userPosition) => {
      return {
        ...userPosition,
        pendingReva: stringToBigNumber(userPosition.pendingReva),
        revaStaked: stringToBigNumber(userPosition.revaStaked),
      };
    });

    return userPositions;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function fetchRevaBalance({ userAddress }) {
  try {
    const revaApi = RevaApi();
    const data = await revaApi.getUserRevaBalance(userAddress);

    return stringToBigNumber(data);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function stakeReva({ poolId, amount }) {
  try {
    const { revaStakingPool } = addresses;

    const revaApi = RevaApi();
    const gasPrice = await revaApi.getGasPrice();

    const txData = await revaApi.stakeReva(poolId, amount);

    // Metamask request logic (approve and sign tx)
    const txParams = {
      to: revaStakingPool,
      from: window.ethereum.selectedAddress,
      value: "0x00",
      data: txData,
      gasPrice,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    const stakeRevaTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    return stakeRevaTxHash;
  } catch (error) {
    // TODO parse error to fit FE structure
    activateErrorNotification(error);
    const parsedError = error;
    throw parsedError;
  }
}

export async function unstakeReva({ poolId, amount, isEarly }) {
  try {
    const { revaStakingPool } = addresses;

    const revaApi = RevaApi();
    const gasPrice = await revaApi.getGasPrice();

    let txData;
    if (isEarly) {
      txData = await revaApi.unstakeRevaEarly(poolId, amount);
    } else {
      txData = await revaApi.unstakeReva(poolId, amount);
    }

    // Metamask request logic (approve and sign tx)
    const txParams = {
      to: revaStakingPool,
      from: window.ethereum.selectedAddress,
      value: "0x00",
      data: txData,
      gasPrice,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    const unstakeRevaTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    return unstakeRevaTxHash;
  } catch (error) {
    console.error(error.stack);
    // TODO parse error to fit FE structure
    console.error(error.stack);
    activateErrorNotification(error);
    const parsedError = error;
    throw parsedError;
  }
}

export async function claimReva({ poolId }) {
  try {
    const { revaStakingPool } = addresses;

    const revaApi = RevaApi();
    const gasPrice = await revaApi.getGasPrice();
    const txData = await revaApi.claimRevaStakeReward(poolId);

    // Metamask request logic (approve and sign tx)
    const txParams = {
      to: revaStakingPool,
      from: window.ethereum.selectedAddress,
      value: "0x00",
      data: txData,
      gasPrice,
    };
    txParams.gas = await revaApi.getGasLimit(txParams, GEM);

    const claimRevaTxHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txParams],
    });

    return claimRevaTxHash;
  } catch (error) {
    console.log(error);
    activateErrorNotification(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}
