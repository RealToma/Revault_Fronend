import { call, put, takeLatest, all } from "redux-saga/effects";
import {
  StakeActionTypes,
  loadStakeDataSuccess,
  loadStakeDataFailure,
} from "../actions/stakeActions";
import {
  fetchRevaStakingPools,
  fetchUserRevaStakingPoolPositions,
} from "./stake";

function* onFetchStakeData(payload) {
  try {
    const [pools, userPositions] = yield all([
      call(fetchRevaStakingPools, payload),
      call(fetchUserRevaStakingPoolPositions, {
        userAddress: window.ethereum.selectedAddress,
      }),
    ]);

    yield put(loadStakeDataSuccess({ pools, userPositions }));
  } catch (error) {
    yield put(loadStakeDataFailure(error));
  }
}

export default function* root() {
  yield takeLatest(StakeActionTypes.LOAD_STAKE_DATA, onFetchStakeData);
}
