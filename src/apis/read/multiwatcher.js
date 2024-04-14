/* eslint-disable no-undef */
const createWatcher = require("@makerdao/multicall");
const { ethers } = require("ethers");

const { config } = require("../../config/config");
const addresses = config.getNetworkAddresses();

const revaTokenAddress = addresses.revaToken;
const revaChefAddress = addresses.revaChef;
const deadAddress = addresses.dead;
const zapAddress = addresses.zap;

const multicallConfig = {
  rpcUrl: config.getProviderUrl(),
  multicallAddress: "0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb",
};

let balanceWatcher = undefined;
let balances = {};
async function watchBalances(userAddress, tokens) {
  if (balanceWatcher) {
    return;
  }
  const balancesRquests = tokens.map((token) => {
    if (token.symbol == "bnb") {
      return {
        call: ["getEthBalance(address)(uint256)", userAddress],
        returns: [
          [
            token.symbol,
            (val) => ethers.utils.formatUnits(val, token.decimals),
          ],
        ],
      };
    }

    return {
      target: token.address,
      call: ["balanceOf(address)(uint256)", userAddress],
      returns: [
        [token.symbol, (val) => ethers.utils.formatUnits(val, token.decimals)],
      ],
    };
  });

  balanceWatcher = createWatcher.createWatcher(
    balancesRquests,
    multicallConfig,
  );
  balanceWatcher.batch().subscribe((updates) => {
    for (const update of updates) {
      balances[update["type"]] = update["value"];
    }
  });
  balanceWatcher.start();
  balanceWatcher.awaitInitialFetch();
}

function getBalances() {
  return balances;
}

let statsWatcher = undefined;
let revaStats = {};
async function watchRevaStats() {
  if (statsWatcher) {
    return;
  }

  let statsRquests = [];
  statsRquests.push({
    target: revaTokenAddress,
    call: ["totalSupply()(uint256)"],
    returns: [[`circSupply`, (val) => val]],
  });

  statsRquests.push({
    target: revaTokenAddress,
    call: ["MAX_SUPPLY()(uint256)"],
    returns: [[`maxSupply`, (val) => val]],
  });

  statsRquests.push({
    target: zapAddress,
    call: [
      "getBUSDValue(address,uint256)(uint256)",
      revaTokenAddress,
      ethers.utils.parseEther("1"),
    ],
    returns: [[`revaBusdPrice`, (val) => val]],
  });

  statsRquests.push({
    target: zapAddress,
    call: ["isFlip(address)(bool)", revaTokenAddress],
    returns: [[`revaIsFLIP`, (val) => val]],
  });

  statsRquests.push({
    target: revaTokenAddress,
    call: ["balanceOf(address)(uint256)", deadAddress],
    returns: [[`burnedRevaAmount`, (val) => val]],
  });

  statsRquests.push({
    target: revaChefAddress,
    call: ["totalRevaultTvlBusd()(uint256)"],
    returns: [[`revaTvlBusd`, (val) => val]],
  });

  statsWatcher = createWatcher.createWatcher(statsRquests, multicallConfig);
  statsWatcher.batch().subscribe((updates) => {
    for (const update of updates) {
      revaStats[update["type"]] = update["value"];
    }
  });
  statsWatcher.start();
  statsWatcher.awaitInitialFetch();
}

function getRevaStats() {
  return revaStats;
}

export { watchBalances, getBalances, watchRevaStats, getRevaStats };
