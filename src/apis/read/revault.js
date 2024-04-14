const { ethers } = require("ethers");

const { bnWeiToFloat } = require("../utils/format");

const addresses = require("../../config/config").config.getNetworkAddresses();

const revaultAbi = require("../../abi/ReVault.json");

function getRevaultContract(provider) {
  return new ethers.Contract(addresses.revault, revaultAbi, provider);
}

async function getUserProxyContractAddress(provider, userAddress) {
  const revaultContract = getRevaultContract(provider);
  return revaultContract.userProxyContractAddress(userAddress);
}

async function getUserVaultPrincipal(provider, vid, userAddress) {
  const revaultContract = getRevaultContract(provider);
  return revaultContract.userVaultPrincipal(vid, userAddress);
}

async function getPercentageOfProfitsConvertedToReva(provider) {
  const revaultContract = getRevaultContract(provider);
  const profitDistributionPrecision =
    await revaultContract.PROFIT_DISTRIBUTION_PRECISION();
  const profitToReva = await revaultContract.profitToReva();
  return bnWeiToFloat(profitToReva) / bnWeiToFloat(profitDistributionPrecision);
}

async function getPercentageOfProfitsDistributedToStakers(provider) {
  const revaultContract = getRevaultContract(provider);
  const profitDistributionPrecision =
    await revaultContract.PROFIT_DISTRIBUTION_PRECISION();
  const profitToRevaStakers = await revaultContract.profitToRevaStakers();
  return (
    bnWeiToFloat(profitToRevaStakers) /
    bnWeiToFloat(profitDistributionPrecision)
  );
}

export {
  getRevaultContract,
  getUserProxyContractAddress,
  getUserVaultPrincipal,
  getPercentageOfProfitsConvertedToReva,
  getPercentageOfProfitsDistributedToStakers,
};
