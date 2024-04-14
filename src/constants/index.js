export const TOKEN_CODE_AUTOFARM = "TOKEN_CODE_AUTOFARM";
export const TOKEN_CODE_BNB = "TOKEN_CODE_BNB";
export const TOKEN_CODE_WBNB = "TOKEN_CODE_WBNB";
export const TOKEN_CODE_CAKE = "TOKEN_CODE_CAKE";
export const TOKEN_CODE_BUSD = "TOKEN_CODE_BUSD";
export const TOKEN_CODE_BTCB = "TOKEN_CODE_BTCB";
export const TOKEN_CODE_ETH = "TOKEN_CODE_ETH";
export const TOKEN_CODE_COMING_SOON = "TOKEN_CODE_COMING_SOON";
export const TOKEN_CODE_ACRYPTOS = "TOKEN_CODE_ACRYPTOS";
export const TOKEN_CODE_BVAULTS = "TOKEN_CODE_BVAULTS";
export const TOKEN_CODE_REVA = "TOKEN_CODE_REVA";

export const TOKEN_CODE_MAP = {
  wbnb: TOKEN_CODE_WBNB,
  bnb: TOKEN_CODE_BNB,
  busd: TOKEN_CODE_BUSD,
  cake: TOKEN_CODE_CAKE,
  btcb: TOKEN_CODE_BTCB,
  eth: TOKEN_CODE_ETH,
  reva: TOKEN_CODE_REVA,
};

export const web3SessionKey = "web3SessionKey";

export const QUERY_KEYS = {
  revaStakeBalance: "RevaStakeBalance",
  revaLPPool: "RevaLPPoolData",
  revaBNBLP: "RevaBNBLPData",
  revaLPPoolPositions: "RevaLPPoolPositionsData",
  revaBNBToBusdRate: "RevaBNBToBusdRateData",
  revaToBusdRate: "RevaToBusdRateData",
  revaLpLiquidityRatio: "RevaLpLiquidityRatio",
  isTokenApproved: "isTokenApproved",
  vaultFees: "vaultFees",
};

export const NOTIFICATION_TYPES = Object.freeze({
  CONFIRMED: "CONFIRMED",
  REJECTED: "REJECTED",
  FAILED: "FAILED",
  PENDING: "PENDING",
  GENERAL_ERROR: "GENERAL_ERROR",
});

export const GET_TOKEN_LINK =
  "https://pancakeswap.finance/swap?outputCurrency=";
export const BSC_SCAN_TX_LINK = "https://bscscan.com/tx/";
export const PANCAKESWAP_ADD_BNB_URL = "https://pancakeswap.finance/add/BNB/";

export const METAMASK_API_ERROR_TYPES = Object.freeze({
  USER_REJECT: 4001,
});

export const APP_MAIN_URL = "https://app.revault.network/";
export const REVAULT_LANDING_PAGE = "https://www.revault.network/";
export const GA_TRACKING_ID = "G-E812SB1K8P"; //prod - "G-XPCL8QHE50";

export const LINK_TYPES = Object.freeze({
  EMAIL: 0,
  PHONE: 1,
  INTERNAL: 2,
  EXTERNAL: 3,
});

export const DECIMAL_LIMIT = 18;
