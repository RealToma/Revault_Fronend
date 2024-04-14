import * as types from "../constants/ActionTypes";
import { config } from "../config/config";
import _ from "lodash";

const zapAndDepositAddress = config.getNetworkAddresses().zapAndDeposit;
const revaultAddress = config.getNetworkAddresses().revault;

const initialState = {
  isInitialized: false,
  isRequesting: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_VAULTS:
      return {
        ...state,
        isRequesting: false /* makes loading vault a silent operation */,
      };
    case types.LOAD_VAULTS_SUCCESS:
      return {
        ...state,
        isInitialized: true,
        isRequesting: false,
        data: action.payload.vaultData,
      };
    case types.LOAD_VAULTS_FAILURE:
      return {
        ...state,
        isInitialized: true,
        isRequesting: false,
      };
    case types.COMMIT_VAULTS_CACHE:
      return {
        ...state,
        cache: { ...state.cache, ...action.payload },
      };
    case types.APPROVAL_SUCCESS:
      return updateTokenApproval(action.payload, state);
    default:
      return state;
  }
};

function updateTokenApproval({ tokenAddress, targetAddress }, state) {
  // flags that we will be setting:
  const approvedRevault = targetAddress === revaultAddress;
  const approvedZapAndDeposit = targetAddress === zapAndDepositAddress;

  const stateCopy = { ...state };

  const dataRef = state.data;
  const cacheRef = state.cache;

  // update data
  dataRef.allPositions.forEach((position) => {
    position.tokenDetails = setApprovalIfNeeded(
      position.tokenDetails,
      position.tokenDetails.address,
      tokenAddress,
      approvedRevault,
      approvedZapAndDeposit,
    );
  });
  dataRef.allUserTokens.map((token) =>
    setApprovalIfNeeded(
      token,
      token.tokenDetails.address,
      tokenAddress,
      approvedRevault,
      approvedZapAndDeposit,
    ),
  );

  // update request cache
  const targetTokenId = _.find(dataRef.tokenSymbolMap, {
    address: tokenAddress,
  })?.tokenId;
  if (targetTokenId) {
    cacheRef.allUserTokens.map((token) =>
      setApprovalIfNeeded(
        token,
        token.tokenId,
        targetTokenId,
        approvedRevault,
        approvedZapAndDeposit,
      ),
    );
  }

  return stateCopy;
}

function setApprovalIfNeeded(
  data,
  srcTokenAddress,
  targetTokenAddress,
  approvedRevault,
  approvedZapAndDeposit,
) {
  // if it's not the token we are looking to update, skip it
  if (srcTokenAddress !== targetTokenAddress) {
    return data;
  }

  // update one of the relevant 'approvad' flags:
  if (approvedRevault) {
    data.approvedRevault = approvedRevault;
  } else if (approvedZapAndDeposit) {
    data.approvedZapAndDeposit = approvedZapAndDeposit;
  }

  // return the updated token data:
  return data;
}
