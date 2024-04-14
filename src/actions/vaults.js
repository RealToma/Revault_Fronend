import * as types from "../constants/ActionTypes";

/* Load */

export const loadVaults = (isMetaMaskConnected) => {
  return { type: types.LOAD_VAULTS, isMetaMaskConnected };
};

export function loadVaultsSuccess(vaultData) {
  return {
    type: types.LOAD_VAULTS_SUCCESS,
    payload: {
      vaultData,
    },
  };
}

export function loadVaultsFailure(error) {
  return {
    type: types.LOAD_VAULTS_FAILURE,
    payload: {
      error,
    },
  };
}

/* Commit Vaulrs Cache */

export const commitVaultsCache = (cache) => {
  return { type: types.COMMIT_VAULTS_CACHE, payload: cache };
};

/* Refresh Position */

export const refreshVault = (tokenId) => {
  return { type: types.REFRESH_VAULT, tokenId };
};

/* Periodic Update */

export const periodicUpdate = () => {
  return { type: types.PERIODIC_UPDATE };
};

/* Mark Approval successful */

export const approvalSuccess = (payload) => {
  return { type: types.APPROVAL_SUCCESS, payload };
};
