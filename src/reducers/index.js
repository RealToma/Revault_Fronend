import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import vaultsReducer from "./vaultsReducer";
import stakeReducer from "./stakeReducer";

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    vaultsState: vaultsReducer,
    stakeState: stakeReducer,
  });
