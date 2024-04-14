import Big from "big.js";
import * as coinTypes from "../constants";
import _ from "lodash";

import acryptosColor from "../assets/coin-logo-acryptos-color.png";
import acryptosBW from "../assets/coin-logo-acryptos-bw.png";
import autofarmColor from "../assets/logo-pair-autofarm-color.png";
import autofarmBW from "../assets/logo-pair-autofarm-bw.png";
import beefyColor from "../assets/logo-pair-beefy-color.png";
import beefyBW from "../assets/logo-pair-beefy-bw.png";
import bunnyColor from "../assets/logo-pair-bunny-color.png";
import bunnyBW from "../assets/logo-pair-bunny-bw.png";
import bvaultsColor from "../assets/coin-logo-bvaults-color.png";
import bvaultsBW from "../assets/coin-logo-bvaults-bw.png";
import bnb from "../assets/coin-logo-bnb.png";
import cake from "../assets/coin-logo-cake.png";
import busd from "../assets/coin-logo-busd.png";
import btcb from "../assets/coin-logo-btcb.png";
import eth from "../assets/coin-logo-eth.png";
import comingSoon from "../assets/coin-logo-coming-soon.png";
import revaultLogo from "../assets/revault-logo.png";
import { getToken } from "../apis/utils/addresses";

export function vaultLogo(vaultCode, active = false) {
  switch (vaultCode) {
    case "beefy":
      return active ? beefyColor : beefyBW;
    case "autofarm":
      return active ? autofarmColor : autofarmBW;
    case "bunny":
      return active ? bunnyColor : bunnyBW;
    default:
      return null;
  }
}

export function coinLogo(coin, active = false) {
  switch (coin) {
    case coinTypes.TOKEN_CODE_ACRYPTOS:
      return active ? acryptosColor : acryptosBW;
    case coinTypes.TOKEN_CODE_AUTOFARM:
      return active ? autofarmColor : autofarmBW;
    case coinTypes.TOKEN_CODE_BVAULTS:
      return active ? bvaultsColor : bvaultsBW;
    case coinTypes.TOKEN_CODE_WBNB:
    case coinTypes.TOKEN_CODE_BNB:
      return bnb;
    case coinTypes.TOKEN_CODE_CAKE:
      return cake;
    case coinTypes.TOKEN_CODE_BUSD:
      return busd;
    case coinTypes.TOKEN_CODE_BTCB:
      return btcb;
    case coinTypes.TOKEN_CODE_ETH:
      return eth;
    case coinTypes.TOKEN_CODE_COMING_SOON:
      return comingSoon;
    case coinTypes.TOKEN_CODE_REVA:
      return revaultLogo;
    default:
      return null;
  }
}

export const TOKEN_NAMES = {
  [coinTypes.TOKEN_CODE_ACRYPTOS]: "ACRYPTOS",
  [coinTypes.TOKEN_CODE_AUTOFARM]: "AUTOFARM",
  [coinTypes.TOKEN_CODE_BVAULTS]: "BVAULTS",
  [coinTypes.TOKEN_CODE_BNB]: "BNB",
  [coinTypes.TOKEN_CODE_WBNB]: "WBNB",
  [coinTypes.TOKEN_CODE_BUSD]: "BUSD",
  [coinTypes.TOKEN_CODE_CAKE]: "CAKE",
  [coinTypes.TOKEN_CODE_BTCB]: "BTCB",
  [coinTypes.TOKEN_CODE_ETH]: "ETH",
};

export const TOKEN_DESCRIPTION = {
  [coinTypes.TOKEN_CODE_BNB]: "Binance Coin",
  [coinTypes.TOKEN_CODE_WBNB]: "Wrapped Binance Coin",
  [coinTypes.TOKEN_CODE_BUSD]: "Binance USD Coin",
  [coinTypes.TOKEN_CODE_CAKE]: "PancakeSwap Token",
  [coinTypes.TOKEN_CODE_BTCB]: "Binance-Peg Bitcoin",
  [coinTypes.TOKEN_CODE_ETH]: "Binance-Peg Ethereum",
};

export const VAULT_NAMES = {
  autofarm: "AUTOFARM",
  bunny: "BUNNY",
  beefy: "BEEFY",
};

export const POOL_TIERS = {
  1: "Bronze",
  2: "Silver",
  3: "Gold",
  4: "Premium",
};

/** Functions */

export function formatNumericString(input) {
  if (!isNumericString(input)) {
    return input;
  }
  input += "";
  const inputSplit = input.split(".");
  let quotient = inputSplit[0];
  let remainder = inputSplit.length > 1 ? "." + inputSplit[1] : "";
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(quotient)) {
    quotient = quotient.replace(rgx, "$1" + "," + "$2");
  }
  return quotient + remainder;
}

export const mockBackendCall = (success, timeout) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve();
      } else {
        reject({ message: "Error" });
      }
    }, timeout);
  });
};

export function numberWithCommas(number) {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isNumericString(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

export function stringToBigNumber(input) {
  if (input) {
    return new Big(input);
  }
  return input;
}

export const getTokenLink = (tokenSymbol) => {
  return coinTypes.GET_TOKEN_LINK + getToken(tokenSymbol).address;
};

export const getTokenSymbolName = (tokenSymbol = "") => {
  return `${tokenSymbol.toUpperCase() || ""} ${
    tokenSymbol.includes("-") ? "LP" : ""
  }`;
};

const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx"];

export function abbreviateNumber(
  value,
  format,
  precision,
  addTrailingSpace,
  defaultDisplayValue = "0.000",
) {
  if (!(value && (value instanceof Big || isNumericString(`${value}`)))) {
    return defaultDisplayValue;
  }

  let valueBigNumber = new Big(value);

  let suffixIndex = 0;
  if (valueBigNumber.gt(1000)) {
    while (valueBigNumber.gt(1000)) {
      valueBigNumber = valueBigNumber.div(1000);
      suffixIndex++;
    }
    valueBigNumber = valueBigNumber.round(2);
  } else {
    valueBigNumber = valueBigNumber.round(precision);
  }

  const valueString = valueBigNumber.eq(0)
    ? defaultDisplayValue
    : valueBigNumber.toString();
  const result =
    suffixIndex === 0 && format
      ? formatNumericString(valueString)
      : valueString + (suffixes[suffixIndex] || "");
  return `${result}${addTrailingSpace && suffixIndex > 0 ? " " : ""}`;
}

export function getShortTxHash(txHash, margin = 4) {
  if (_.isEmpty(txHash)) {
    return "";
  }
  return txHash.replace(
    txHash.substring(margin + 2, txHash.length - margin),
    "....",
  );
}
