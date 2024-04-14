const { ethers } = require("ethers");

const addresses = require("../../config/config").config.getNetworkAddresses();

const tokenAbi = require("../../abi/IBEP20.json");
const zapAbi = require("../../abi/Zap.json");

const { format } = require("../utils/format.js");
const {
  getTokenById,
  getAllTradeableTokensNoRevaNoWbnb,
} = require("../utils/addresses.js");

const { watchBalances, getBalances } = require("./multiwatcher.js");

async function getUserBalances(provider, userAddress) {
  const tokens = getAllTradeableTokensNoRevaNoWbnb();
  await watchBalances(userAddress, tokens);
  const balances = getBalances();
  const tokenUsdRates = await Promise.all(
    tokens.map((token) => getTokenToBusdRate(provider, token.tokenId)),
  );
  const tokenApprovals = await Promise.all(
    tokens.map(async (token) => {
      if (token.symbol !== "bnb") {
        return {
          revault: await hasUserApprovedInfinity(
            provider,
            token.address,
            userAddress,
            addresses.revault,
          ),
          zapAndDeposit: await hasUserApprovedInfinity(
            provider,
            token.address,
            userAddress,
            addresses.zapAndDeposit,
          ),
        };
        // BNB is not a token and doesn't need approval
      } else {
        return {
          revault: true,
          zapAndDeposit: true,
        };
      }
    }),
  );
  const data = tokens.map((token, idx) => ({
    balance: balances[token.symbol],
    tokenId: token.tokenId,
    valuePerToken: tokenUsdRates[idx],
    approvedRevault: tokenApprovals[idx]["revault"],
    approvedZapAndDeposit: tokenApprovals[idx]["zapAndDeposit"],
  }));
  return data;
}

async function getUserBalance(provider, userAddress, tokenId) {
  const token = getTokenById(tokenId);

  if (token.symbol == "bnb") {
    const userBalance = await provider.getBalance(userAddress);
    return format(userBalance, token.decimals);
  } else {
    return getUserBalanceByTokenAddress(
      provider,
      userAddress,
      token.address,
      token.decimals,
    );
  }
}

async function getUserBalanceByTokenAddress(
  provider,
  userAddress,
  tokenAddress,
  tokenDecimals,
) {
  tokenDecimals = tokenDecimals || 18;

  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
  const userBalance = await tokenContract.balanceOf(userAddress);

  return format(userBalance, tokenDecimals);
}

async function getAllTokenToBusdRates(provider) {
  const tokens = getAllTradeableTokensNoRevaNoWbnb();
  const rates = await Promise.all(
    tokens.map(async (token) => {
      return {
        tokenId: token.tokenId,
        busdPerToken: await getTokenToBusdRate(provider, token.tokenId),
      };
    }),
  );
  return rates;
}

async function getTokenToBusdRate(provider, tokenId) {
  const token = getTokenById(tokenId);
  const zapContract = new ethers.Contract(addresses.zap, zapAbi, provider);
  const tokenUnitAmount = ethers.utils.parseUnits("1", token.decimals);
  const busdAmount = await zapContract.getBUSDValue(
    token.address,
    tokenUnitAmount,
  );
  return format(busdAmount);
}

async function hasUserApprovedInfinity(
  provider,
  tokenAddress,
  userAddress,
  toAddress,
) {
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);

  const userApproval = await tokenContract.allowance(userAddress, toAddress);
  // greater than 10^40 is big enough
  const hugeNumber = ethers.utils.parseEther("100000000000000000");
  return userApproval.gt(hugeNumber);
}

// TODO: in case we don't approve infinity
/*
async function getUserApprovalAmount(
  provider,
  tokenId,
  userAddress,
  toAddress,
) {}*/

export {
  getUserBalance,
  getUserBalances,
  getUserBalanceByTokenAddress,
  getAllTokenToBusdRates,
  getTokenToBusdRate,
  hasUserApprovedInfinity,
};
