import { fork, all } from "redux-saga/effects";
import watchVaults from "./vaultsSaga";
import watchStake from "./stakeSaga";

export default function* rootSaga() {
  yield all([fork(watchVaults), watchStake()]);
}
