const { ethers } = require("ethers");

const addresses = require("../../config/config").config.getNetworkAddresses();
const { getTokenById } = require("../utils/addresses");

const zapAbi = require("../../abi/zap.json");

const zapAddress = addresses.zap;

async function getExpectedAmount(provider, fromTokenId, toTokenId, amount) {
  const fromToken = getTokenById(fromTokenId);
  const toToken = getTokenById(toTokenId);

  // TODO zap contract is too large already.
  //const zapContract = new ethers.Contract(zapAddress, zapAbi, provider);

  //const expectedAmount = await zapContract.getExpectedAmount(fromToken.address, toToken.address, amount);
  //return expectedAmount.toString();
}

export { getExpectedAmount };
