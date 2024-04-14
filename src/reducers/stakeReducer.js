import { StakeActionTypes } from "../actions/stakeActions";

export const StakeReducerStates = Object.freeze({
  Loading: "loading",
  Resolved: "resolved",
  Rejected: "rejected",
});

const initialState = {
  status: StakeReducerStates.Loading,
  data: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case StakeActionTypes.LOAD_STAKE_DATA:
      return {
        ...state,
        status: StakeReducerStates.Loading,
      };
    case StakeActionTypes.LOAD_STAKE_DATA_SUCCESS:
      return {
        ...state,
        status: StakeReducerStates.Resolved,
        data: action.payload.stakeData,
      };
    case StakeActionTypes.LOAD_STAKE_DATA_FAILURE:
      return {
        ...state,
        status: StakeReducerStates.Rejected,
        error: action.error,
      };

    default:
      return state;
  }
};
