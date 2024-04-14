const { ethers } = require("ethers");

function format(bignumber, decimals = 18) {
  return ethers.utils.formatUnits(bignumber, decimals);
}

function bnWeiToFloat(bignumber, units) {
  units = units || 18;
  return parseFloat(ethers.utils.formatUnits(bignumber, units));
}

function bnWeiToString(bignumber, units, precision) {
  units = units || 18;
  precision = precision || 2;
  return parseFloat(
    parseFloat(ethers.utils.formatUnits(bignumber, units)).toFixed(precision),
  ).toLocaleString();
}

export { format, bnWeiToFloat, bnWeiToString };
