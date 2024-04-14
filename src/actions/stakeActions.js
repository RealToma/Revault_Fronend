export const StakeActionTypes = Object.freeze({
  LOAD_STAKE_DATA: "LOAD_STAKE_DATA",
  LOAD_STAKE_DATA_SUCCESS: "LOAD_STAKE_DATA_SUCCESS",
  LOAD_STAKE_DATA_FAILURE: "LOAD_STAKE_DATA_FAILURE",
});

export const loadStakeData = () => {
  return { type: StakeActionTypes.LOAD_STAKE_DATA };
};

export function loadStakeDataSuccess(stakeData) {
  return {
    type: StakeActionTypes.LOAD_STAKE_DATA_SUCCESS,
    payload: { stakeData },
  };
}

export function loadStakeDataFailure(error) {
  return {
    type: StakeActionTypes.LOAD_STAKE_DATA_FAILURE,
    payload: {
      error,
    },
  };
}
