import { put, takeLatest, call, all, select, delay } from "redux-saga/effects";
import _ from "lodash";
import Big from "big.js";
import { RevaApi } from "../apis";

import {
  LOAD_VAULTS,
  PERIODIC_UPDATE,
  REFRESH_VAULT,
} from "../constants/ActionTypes";
import {
  loadVaultsSuccess,
  loadVaultsFailure,
  commitVaultsCache,
  periodicUpdate,
} from "../actions/vaults";

import { TOKEN_CODE_MAP } from "../constants";
import { stringToBigNumber } from "../helpers/utils";

import { getAllTokens, getAllVaults } from "../apis/utils/addresses";

const balanceRefreshDelayMs =
  require("../config/config").config.getSystemConfig().balanceRefreshDelayMs;

const config = require("../config/config").config;

const getIsInitialized = (state) => state.vaultsState.isInitialized;
const getCache = (state) => state.vaultsState.cache;

const converVaultToBigNumber = (vault) => {
  vault.principalNative = stringToBigNumber(vault.principalNative);
  vault.principalBalanceBusd = stringToBigNumber(vault.principalBalanceBusd);
  vault.depositTokenRewardBusd = stringToBigNumber(
    vault.depositTokenRewardBusd,
  );
  vault.revaRewardBusd = stringToBigNumber(vault.revaRewardBusd);
  vault.pendingProfitNative = stringToBigNumber(vault.pendingProfitNative);
};

const converPositionToBigNumber = (position) => {
  position.rate = stringToBigNumber(position.rate);
  position.revaApy = stringToBigNumber(position.revaApy);
  position.valuePerToken = stringToBigNumber(position.valuePerToken);
};

const tokenMap = Object.assign(
  {},
  ...getAllTokens().map((t) => ({ [t.tokenId]: t })),
); // convert token array to hash map with token id as key

const tokenSymbolMap = Object.assign(
  {},
  ...getAllTokens().map((t) => ({ [t.symbol]: t })),
);

const vaultMap = Object.assign(
  {},
  ...getAllVaults().map((v) => ({ [v.additionalData.vid]: v })),
); // convert vaults array to hash map with vault id as key

function processVaults(vaults = []) {
  vaults.length = Math.min(vaults.length, 5); // limit number of vaults at 5
  return vaults
    .sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy))
    .map((v) => {
      return {
        ...v,
        apyNumeric: parseFloat(v.apy),
        details: vaultMap[v.vaultId],
      };
    });
}

function processTokens(
  allPositions = [],
  allUserPositions = [],
  exchangeRatesMap,
  allUserTokensMap = {},
  isConnected,
) {
  const allUserPositionsMap = Object.assign(
    {},
    ...allUserPositions.map((p) => ({ [p.tokenId]: p })),
  );
  return allPositions.map((p) => {
    const tokenDetails = {
      ...allUserTokensMap[p.tokenId],
      ...tokenMap[p.tokenId],
    };
    const symbol = tokenDetails.symbol;
    if (symbol.includes("-")) {
      const split = symbol.split("-");
      tokenDetails.codes = split.map((s) => TOKEN_CODE_MAP[s]);
    } else {
      tokenDetails.codes = [TOKEN_CODE_MAP[symbol]];
    }
    const userPosition = allUserPositionsMap[p.tokenId];
    userPosition?.userVaults?.sort((v1, v2) =>
      v1.principalBalanceBusd.gt(v2.principalBalanceBusd) ? -1 : 1,
    );
    const userVault =
      userPosition && userPosition.userVaults?.length > 0
        ? userPosition.userVaults[0]
        : undefined;
    const tokenBalanceObject = allUserTokensMap[p.tokenId];

    const vaults = processVaults(p.vaults);

    const position = vaults?.find(
      (p) => p.vaultId === userVault?.additionalData?.vid,
    );
    const inPosition =
      isConnected && !_.isEmpty(position) && userVault?.principalNative.gt(0);

    return {
      ...p,
      tokenDetails,
      userVault,
      position: inPosition ? position : undefined,
      inPosition,
      tokenBalance: tokenBalanceObject
        ? new Big(tokenBalanceObject.balance)
        : new Big(0),
      vaults,
      exchangeRate: exchangeRatesMap ? exchangeRatesMap[p.tokenId] : undefined,
    };
  });
}

function calculateVaultState(data, isConnected) {
  const {
    stats,
    allPositions = [],
    allUserPositions = [],
    allUserTokens = [],
    exchangeRatesMap,
    accounts,
  } = data;

  const allUserTokensMap = Object.assign(
    {},
    ...allUserTokens.map((t) => ({ [t.tokenId]: t })),
  );

  return {
    stats: {
      reva: {
        value: parseFloat(stats.revaPrice),
        fiatCurrency: "USD",
      },
      currEmissions: stats.currEmissions,
      maxSupply: parseFloat(stats.maxSupply),
      totalSupply: parseFloat(stats.totalSupply),
      circulatingSupply: parseFloat(stats.circSupply),
    },
    allPositions: processTokens(
      allPositions,
      allUserPositions,
      exchangeRatesMap,
      allUserTokensMap,
      isConnected,
    ),
    allUserTokens: processTokens(
      allUserTokens,
      allUserPositions,
      exchangeRatesMap,
      {},
      isConnected,
    ),
    exchangeRatesMap,
    accounts,
    tokenSymbolMap,
  };
}

function* workerLoadVaults(action) {
  try {
    const revaApi = RevaApi();

    let stats,
      allPositions = [],
      allUserPositions = [],
      allUserTokens = [],
      exchangeRatesMap,
      accounts;

    const requests = [call(revaApi.stats), call(revaApi.getAllPositions)];
    if (action.isMetaMaskConnected) {
      console.log("metamask connected");
      requests.push(
        call(revaApi.getAllUserPositions, window.ethereum.selectedAddress),
        call(revaApi.userTokenBalances, window.ethereum.selectedAddress),
        call(revaApi.tokenRates),
        call(window.ethereum.request, {
          method: "eth_requestAccounts",
        }),
      );
    }
    const responses = yield all(requests);

    stats = responses[0];
    allPositions = responses[1];

    if (responses.length === 6 /* TODO: replace with smarter check */) {
      allUserPositions = responses[2];
      allUserTokens = responses[3];
      exchangeRatesMap = Object.assign(
        {},
        ...responses[4].map((t) => ({
          [t.tokenId]: {
            ...t,
            busdPerToken: stringToBigNumber(t.busdPerToken),
          },
        })),
      );
      accounts = responses[5];
      console.log("connected account: " + window.ethereum.selectedAddress);
    }

    // convert specific fields from string to BigNumber
    allPositions.forEach(converPositionToBigNumber);
    allUserPositions.forEach((p) => {
      p.userVaults.forEach(converVaultToBigNumber);
    });

    // agregate fetched data
    const incomingData = {
      stats,
      allPositions,
      allUserPositions,
      allUserTokens,
      exchangeRatesMap,
      accounts,
    };

    // cache it
    yield put(commitVaultsCache(incomingData));

    // build vaults state object
    const payload = calculateVaultState(
      incomingData,
      action.isMetaMaskConnected,
    );

    const isInitialized = yield select(getIsInitialized); // this check needs to be performed bedore 'loadVaultsSuccess' as this method would set it to true
    const shouldStartPeriodicUpdates = !isInitialized;

    yield put(loadVaultsSuccess(payload));

    if (shouldStartPeriodicUpdates) {
      yield put(periodicUpdate());
    }
  } catch (error) {
    console.log(error.stack);
    yield put(loadVaultsFailure(error));
  }
}

function* workerRefreshVault(action) {
  try {
    const cachedData = yield select(getCache);

    const revaApi = RevaApi();
    const response = yield call(
      revaApi.getUserPositions,
      window.ethereum.selectedAddress,
      action.tokenId,
    );

    response.userVaults.forEach(converVaultToBigNumber);

    const newAllUserPositions = cachedData.allUserPositions.map(
      (originalPosition) =>
        originalPosition.tokenId === response.tokenId
          ? response
          : originalPosition,
    );

    yield put(commitVaultsCache({ allUserPositions: newAllUserPositions }));
    cachedData.allUserPositions = newAllUserPositions;

    // build vaults state object
    const payload = calculateVaultState(cachedData, true);
    yield put(loadVaultsSuccess(payload));
  } catch (error) {
    console.log(error.stack);
    yield put(loadVaultsFailure(error));
  }
}

function* workerPeriodicUpdate() {
  try {
    const cachedData = yield select(getCache);

    const revaApi = RevaApi();
    let allUserTokensResponse = yield call(
      revaApi.userTokenBalances,
      window.ethereum.selectedAddress,
    );

    yield put(commitVaultsCache({ allUserTokens: allUserTokensResponse }));
    cachedData.allUserTokens = allUserTokensResponse;

    // build vaults state object
    const payload = calculateVaultState(cachedData, true);
    yield put(loadVaultsSuccess(payload));
  } catch (error) {
    console.log(error.stack);
    yield put(loadVaultsFailure(error));
  }

  yield delay(balanceRefreshDelayMs);

  yield put(periodicUpdate());
}

export default function* root() {
  yield all([
    takeLatest(LOAD_VAULTS, workerLoadVaults),
    takeLatest(REFRESH_VAULT, workerRefreshVault),
    takeLatest(PERIODIC_UPDATE, workerPeriodicUpdate),
  ]);
}
