const { ethers } = require("ethers");

const addresses = require("../../config/config").config.getNetworkAddresses();

const zapAbi = require("../../abi/Zap.json");
const zapAndDepositAbi = require("../../abi/ZapAndDeposit.json");

const { getToken, getTokenById, getVault } = require("../utils/addresses");
const { generateDepositPayload } = require("../utils/payloads");

const zapAddress = addresses.zap;
const zapAndDepositAddress = addresses.zapAndDeposit;

async function zap(provider, fromTokenId, toTokenId, amount) {
  const fromToken = getTokenById(fromTokenId);
  const toToken = getTokenById(toTokenId);

  const zapContract = new ethers.Contract(zapAddress, zapAbi, provider);
  const formattedAmount = ethers.utils.parseUnits(
    String(amount),
    fromToken.decimals,
  );

  let txData;
  if (fromToken.symbol === "bnb") {
    // gross passing of object sometimes, string other times
    txData = await zapContract.populateTransaction.zapIn(toToken.address, {
      value: formattedAmount,
    });
  } else {
    // TODO: do we need to validate allowance..?
    txData = await zapContract.populateTransaction.zapInToken(
      fromToken.address,
      formattedAmount,
      toToken.address,
    );
    txData = txData.data;
  }
  return txData;
}

// Assumptions:
// (1) from token is never WBNB
// (2) from token is never vault deposit token
async function zapAndDeposit(provider, fromTokenId, toVaultId, amount) {
  const vault = getVault(toVaultId);
  const fromToken = getTokenById(fromTokenId);
  const toToken = getToken(vault.depositTokenSymbol);

  const zapAndDepositContract = new ethers.Contract(
    zapAndDepositAddress,
    zapAndDepositAbi,
    provider,
  );

  const formattedAmount = ethers.utils.parseUnits(
    String(amount),
    fromToken.decimals,
  );

  let txData;

  // bnb -> any vault => zapBNBAndDeposit
  if (fromToken.symbol === "bnb") {
    const payload = await generateDepositPayload(toVaultId, formattedAmount);
    const leftPayload = payload.substr(0, payload.length - 64);

    txData = await zapAndDepositContract.populateTransaction.zapBNBAndDeposit(
      toToken.address,
      toVaultId,
      leftPayload,
      "0x",
      { value: formattedAmount },
    );

    // not bnb
  } else {
    // not bnb -> *.bnb => zapTokenToBNBAndDeposit
    if (toToken.symbol === "bnb") {
      const payload = await generateDepositPayload(toVaultId, formattedAmount);
      txData =
        await zapAndDepositContract.populateTransaction.zapTokenToBNBAndDeposit(
          fromToken.address,
          formattedAmount,
          toVaultId,
          payload,
        );

      // not bnb -> not *.bnb => zapInTokenAndDeposit
    } else {
      // TODO: do we need to validate allowance..?
      const payload = await generateDepositPayload(toVaultId, formattedAmount);
      const leftPayload = payload.substr(0, payload.length - 64);
      txData =
        await zapAndDepositContract.populateTransaction.zapInTokenAndDeposit(
          fromToken.address,
          formattedAmount,
          toToken.address,
          toVaultId,
          leftPayload,
          "0x",
        );
    }
  }

  return txData;
}

export { zap, zapAndDeposit };
