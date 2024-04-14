const { ethers } = require("ethers");

const tokenAbi = require("../../abi/IBEP20.json");

const MAX_UINT =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

async function generateApproveInfinityData(tokenAddress, targetAddress) {
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi);
  const txData = await tokenContract.populateTransaction.approve(
    targetAddress,
    MAX_UINT,
  );
  return txData.data;
}

export { generateApproveInfinityData };
