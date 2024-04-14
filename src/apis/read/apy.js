// when integrating with frontend this should be window.fetch?
const fetch = window.fetch;

const { getVault, getAllVaults } = require("../utils/addresses");

// mvp cheat. we can either run our own (open source), or finish onchain apy calculator
const beefyApyUrl = "https://api.beefy.finance/apy/breakdown";
const autoApyUrl = "https://static.autofarm.network/bsc/farm_data.json";
const bunnyApyUrl =
  "https://us-central1-pancakebunny-finance.cloudfunctions.net/api-bunnyData";

let cache = {};

async function getAllApys() {
  const apys = await Promise.all(
    getAllVaults().map(async (v) => ({
      vaultProvider: v.vaultProvider,
      symbol: v.depositTokenSymbol,
      apy: await getApy(v.additionalData.vid),
    })),
  );
  return apys;
}

async function getApy(vaultId) {
  const vault = getVault(vaultId);
  if (vault.vaultProvider === "autofarm") {
    const apy = await getAutofarmApy(vault);
    return (100 * parseFloat(apy)).toFixed(2);
  } else if (vault.vaultProvider === "beefy") {
    const apy = await getBeefyApy(vault);
    return (100 * parseFloat(apy)).toFixed(2);
  } else if (vault.vaultProvider === "bunny") {
    const apy = await getBunnyApy(vault);
    return parseFloat(apy).toFixed(2);
  }
}

async function getAutofarmApy(vault) {
  if (!cache["autofarm"]) {
    const res = await fetch(autoApyUrl, { mode: "cors" });
    cache["autofarm"] = await res.json();
  }
  const apyBreakdown = cache["autofarm"].pools[vault.additionalData.pid];
  return apyBreakdown["APY_total"];
}

async function getBeefyApy(vault) {
  if (!cache["beefy"]) {
    const res = await fetch(beefyApyUrl, { mode: "cors" });
    cache["beefy"] = await res.json();
  }

  let apyBreakdown;

  if (
    vault.depositTokenSymbol === "bnb" ||
    vault.depositTokenSymbol === "busd"
  ) {
    apyBreakdown = cache["beefy"][`venus-${vault.depositTokenSymbol}`];
  } else if (vault.depositTokenSymbol === "cake") {
    apyBreakdown = cache["beefy"]["cake-cakev2"];
  } else {
    apyBreakdown = cache["beefy"][`cakev2-${vault.depositTokenSymbol}`];
  }

  return apyBreakdown ? apyBreakdown.totalApy : 0;
}

async function getBunnyApy(vault) {
  if (!cache["bunny"]) {
    const res = await fetch(bunnyApyUrl, { mode: "cors" });
    cache["bunny"] = await res.json();
  }

  return cache["bunny"].apy[vault.address].apy;
}

export { getApy, getAllApys };
