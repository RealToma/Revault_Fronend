const { ethers } = require("ethers");

const addresses = require("../../config/config").config.getNetworkAddresses();
const { getTokenById } = require("../utils/addresses");

const revaChefAbi = require("../../abi/RevaChef.json");

const revaChefAddress = addresses.revaChef;

async function claim(tokenId) {
  const token = getTokenById(tokenId);

  const revaChefContract = new ethers.Contract(revaChefAddress, revaChefAbi);
  const txData = await revaChefContract.populateTransaction.claim(
    token.address,
  );
  return txData.data;
}

export { claim };
