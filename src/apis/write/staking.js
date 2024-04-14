const { ethers } = require("ethers");
const addresses = require("../../config/config").config.getNetworkAddresses();

const revaStakingPoolAbi = require("../../abi/RevaStakingPool.json");
const revaLpStakingPoolAbi = require("../../abi/RevaLpStakingPool.json");

const revaStakingPoolAddress = addresses.revaStakingPool;
const revaLpStakingPoolAddress = addresses.revaLpStakingPool;

async function stakeRevaLp(poolId, amount) {
  const formattedAmount = ethers.utils.parseEther(String(amount));
  const revaLpStakingPoolContract = new ethers.Contract(
    revaLpStakingPoolAddress,
    revaLpStakingPoolAbi,
  );
  const txData = await revaLpStakingPoolContract.populateTransaction.deposit(
    poolId,
    formattedAmount,
  );
  return txData.data;
}

async function unstakeRevaLp(poolId, amount) {
  const formattedAmount = ethers.utils.parseEther(String(amount));
  const revaLpStakingPoolContract = new ethers.Contract(
    revaLpStakingPoolAddress,
    revaLpStakingPoolAbi,
  );
  const txData = await revaLpStakingPoolContract.populateTransaction.withdraw(
    poolId,
    formattedAmount,
  );
  return txData.data;
}

// different pool id's have different lock times and multipliers
async function stakeReva(poolId, amount) {
  const formattedAmount = ethers.utils.parseEther(String(amount));
  const revaStakingPoolContract = new ethers.Contract(
    revaStakingPoolAddress,
    revaStakingPoolAbi,
  );
  const txData = await revaStakingPoolContract.populateTransaction.deposit(
    poolId,
    formattedAmount,
  );
  return txData.data;
}

async function unstakeReva(poolId, amount) {
  const formattedAmount = ethers.utils.parseEther(String(amount));
  const revaStakingPoolContract = new ethers.Contract(
    revaStakingPoolAddress,
    revaStakingPoolAbi,
  );
  const txData = await revaStakingPoolContract.populateTransaction.withdraw(
    poolId,
    formattedAmount,
  );
  return txData.data;
}

// NOTE: comes with fee
async function unstakeRevaEarly(poolId, amount) {
  const formattedAmount = ethers.utils.parseEther(String(amount));
  const revaStakingPoolContract = new ethers.Contract(
    revaStakingPoolAddress,
    revaStakingPoolAbi,
  );
  const txData =
    await revaStakingPoolContract.populateTransaction.withdrawEarly(
      poolId,
      formattedAmount,
    );
  return txData.data;
}

async function claimRevaReward(poolId) {
  const revaStakingPoolContract = new ethers.Contract(
    revaStakingPoolAddress,
    revaStakingPoolAbi,
  );
  const txData = await revaStakingPoolContract.populateTransaction.deposit(
    poolId,
    0,
  );
  return txData.data;
}

async function claimRevaLpReward(poolId) {
  const revaLpStakingPoolContract = new ethers.Contract(
    revaLpStakingPoolAddress,
    revaLpStakingPoolAbi,
  );
  const txData = await revaLpStakingPoolContract.populateTransaction.deposit(
    poolId,
    0,
  );
  return txData.data;
}

export {
  stakeRevaLp,
  unstakeRevaLp,
  stakeReva,
  unstakeReva,
  unstakeRevaEarly,
  claimRevaReward,
  claimRevaLpReward,
};
