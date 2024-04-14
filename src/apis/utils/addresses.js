const { config } = require("../../config/config");
const addresses = config.getNetworkAddresses();

let tokens = [...addresses.tokens];

// patch until these tokens are properly configured in the config file
Array.prototype.push.apply(tokens, [
  {
    symbol: "reva",
    address: addresses.revaToken,
    decimals: 18,
    isFlip: false,
    tokenId: 101,
    tradeable: true,
  },
  {
    symbol: "vreva",
    address: addresses.vRevaToken,
    decimals: 18,
    isFlip: false,
    tokenId: 102,
    tradeable: false,
  },
  {
    symbol: "reva-bnb",
    address: addresses["reva-bnb"],
    decimals: 18,
    isFlip: true,
    tokenId: 103,
    tradeable: true,
  },
  {
    symbol: "reva-busd",
    address: addresses["reva-busd"],
    decimals: 18,
    isFlip: true,
    tokenId: 104,
    tradeable: true,
  },
]);

/* TOKENS */

function getToken(tokenSymbol) {
  let token = tokens.find(
    (token) => token.symbol.toLowerCase() == tokenSymbol.toLowerCase(),
  );
  if (!token) throw new Error(`token ${tokenSymbol} not found`);
  return token;
}

function getTokenById(tokenId) {
  let token = tokens.find((token) => token.tokenId == tokenId);
  if (!token) throw new Error(`token ID ${tokenId} not found`);
  return token;
}

function getTokenByAddress(tokenAddress) {
  let token = tokens.find(
    (token) => token.address.toLowerCase() == tokenAddress.toLowerCase(),
  );
  if (!token) throw new Error(`token address ${tokenAddress} not found`);
  return token;
}

function getAllTokens() {
  return tokens;
}

function getAllVaultTokens() {
  return tokens.filter((token) =>
    addresses.vaults.find((vault) => vault.depositTokenSymbol == token.symbol),
  );
}

function getAllTokensNoReva() {
  return addresses.tokens;
}

function getAllTradeableTokens() {
  return tokens.filter((token) => token.tradeable);
}

function getAllTradeableTokensNoReva() {
  return getAllTradeableTokens().filter(
    (token) => !token.symbol.toLowerCase().includes("reva"),
  );
}

function getAllTradeableTokensNoRevaNoWbnb() {
  return getAllTradeableTokensNoReva().filter(
    (token) => !token.symbol.toLowerCase().includes("wbnb"),
  );
}

/* VAULTS */

function getVault(vaultId) {
  let vault = addresses.vaults.find(
    (vault) => vault.additionalData.vid == vaultId.toString(),
  );
  if (!vault) throw new Error(`vault ID ${vaultId} not found`);
  return vault;
}

function getVaultsByToken(tokenSymbol) {
  return addresses.vaults.filter(
    (vault) => vault.depositTokenSymbol === tokenSymbol,
  );
}

function getAllVaults() {
  return addresses.vaults;
}

function getVaultName(vaultId) {
  const vault = getVault(vaultId);
  return `${vault.vaultProvider}.${vault.depositTokenSymbol}`;
}

/* EXPORT */

export {
  getToken,
  getTokenById,
  getTokenByAddress,
  getAllTokens,
  getAllVaultTokens,
  getAllTokensNoReva,
  getAllTradeableTokens,
  getAllTradeableTokensNoReva,
  getAllTradeableTokensNoRevaNoWbnb,
  getVault,
  getVaultsByToken,
  getAllVaults,
  getVaultName,
};
