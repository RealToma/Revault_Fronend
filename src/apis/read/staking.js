const { ethers } = require("ethers");
const { format } = require("../utils/format");
const addresses = require("../../config/config").config.getNetworkAddresses();

const revaStakingPoolAbi = require("../../abi/RevaStakingPool.json");
const revaLpStakingPoolAbi = require("../../abi/RevaLpStakingPool.json");
const zapAbi = require("../../abi/Zap.json");

const revaStakingPoolAddress = addresses.revaStakingPool;
const revaLpStakingPoolAddress = addresses.revaLpStakingPool;
const zapAddress = addresses.zap;

// different pool id's have different lock times and multipliers
async function getRevaStakingPools(provider) {
  const revaStakingPoolContract = new ethers.Contract(
    revaStakingPoolAddress,
    revaStakingPoolAbi,
    provider,
  );
  const poolLength = (await revaStakingPoolContract.poolLength()).toNumber();
  let pools = [];
  for (let i = 0; i < poolLength; i++) {
    const pool = await revaStakingPoolContract.poolInfo(i);
    const totalRevaStaked = parseFloat(
      parseFloat(ethers.utils.formatEther(pool.totalSupply)).toFixed(2),
    );
    //const allocPoint = pool.allocPoint.toNumber();
    const vRevaMultiplier = pool.vRevaMultiplier.toNumber();
    const lockPeriod = pool.timeLocked.toNumber(); // client can turn to date?
    const apy = await getRevaStakingPoolApy(provider, i);
    pools.push({
      totalRevaStaked,
      multiplier: vRevaMultiplier,
      lockPeriod,
      apy,
      poolId: i,
    });
  }
  return pools;
}

async function getAllUserRevaStakingPoolPositions(provider, userAddress) {
  try {
    const lastBlock = await provider.getBlock("latest");
    const revaStakingPoolContract = new ethers.Contract(
      revaStakingPoolAddress,
      revaStakingPoolAbi,
      provider,
    );
    const poolLength = (await revaStakingPoolContract.poolLength()).toNumber();
    let userInfo = [];
    for (let i = 0; i < poolLength; i++) {
      try {
        const pendingUserReva = await revaStakingPoolContract.pendingReva(
          i,
          userAddress,
        );
        const userPoolInfo = await revaStakingPoolContract.userPoolInfo(
          i,
          userAddress,
        );
        userInfo.push({
          poolId: i,
          revaStaked: format(userPoolInfo.amount),
          pendingReva: format(pendingUserReva),
          timeStaked:
            lastBlock.timestamp - userPoolInfo.timeDeposited.toNumber(),
        });
      } catch (error) {
        console.error(error);
        userInfo.push({
          poolId: i,
          revaStaked: 0,
          pendingReva: 0,
          timeStaked: 0,
        });
      }
    }
    return userInfo;
  } catch (err) {
    console.error(err);
  }
}

// different pool id's have different lock times and multipliers
async function getRevaLpStakingPools(provider) {
  const revaLpStakingPoolContract = new ethers.Contract(
    revaLpStakingPoolAddress,
    revaLpStakingPoolAbi,
    provider,
  );
  const poolLength = (await revaLpStakingPoolContract.poolLength()).toNumber();
  let pools = [];
  for (let i = 0; i < poolLength; i++) {
    const pool = await revaLpStakingPoolContract.poolInfo(i);
    const totalLpStaked = parseFloat(
      parseFloat(ethers.utils.formatEther(pool.totalSupply)).toFixed(2),
    );
    const allocPoint = pool.allocPoint.toNumber();
    const lpTokenAddress = pool.lpToken;
    const apy = await getRevaLpStakingPoolApy(provider, i);
    pools.push({
      totalLpStaked,
      allocPoint,
      lpTokenAddress,
      apy,
      poolId: i,
    });
  }
  return pools;
}

async function getAllUserRevaLpStakingPoolPositions(provider, userAddress) {
  try {
    const revaLpStakingPoolContract = new ethers.Contract(
      revaLpStakingPoolAddress,
      revaLpStakingPoolAbi,
      provider,
    );
    const poolLength = (
      await revaLpStakingPoolContract.poolLength()
    ).toNumber();
    let userInfo = [];
    for (let i = 0; i < poolLength; i++) {
      try {
        const pendingUserReva = await revaLpStakingPoolContract.pendingReva(
          i,
          userAddress,
        );
        const userPoolInfo = await revaLpStakingPoolContract.userPoolInfo(
          i,
          userAddress,
        );
        userInfo.push({
          poolId: i,
          lpStaked: format(userPoolInfo.amount),
          pendingReva: format(pendingUserReva),
        });
      } catch (error) {
        userInfo.push({
          poolId: i,
          lpStaked: "0",
          pendingReva: "0",
        });
      }
    }
    return userInfo;
  } catch (err) {
    console.log(err);
  }
}

// TODO: take into account transfer fee and 1% performance fee
async function getRevaStakingPoolApy(provider, poolId) {
  const revaStakingPoolContract = new ethers.Contract(
    revaStakingPoolAddress,
    revaStakingPoolAbi,
    provider,
  );
  const pool = await revaStakingPoolContract.poolInfo(poolId);
  const { allocPoint, totalSupply } = pool;
  if (totalSupply.toString() === "0") {
    console.warn(`Total REVA staked to pool id ${poolId}, returning 0% apy`);
    return 0;
  }
  const totalAllocPoint = await revaStakingPoolContract.totalAllocPoint();
  const revaPerBlock = await revaStakingPoolContract.revaPerBlock();
  const blocksPerYear = "10518975";
  const accRevaPerYear = revaPerBlock
    .mul(blocksPerYear)
    .mul(allocPoint)
    .div(totalAllocPoint);
  const revaStakeApr = accRevaPerYear
    .mul(ethers.utils.parseEther("1"))
    .div(totalSupply);
  const formattedApr = ethers.utils.formatEther(revaStakeApr);
  // for percentage, multiply by 100
  return parseFloat((formattedApr * 100).toFixed(2));
}

// TODO: take into account transfer fee and 1% performance fee
async function getRevaLpStakingPoolApy(provider, poolId) {
  const revaLpStakingPoolContract = new ethers.Contract(
    revaLpStakingPoolAddress,
    revaLpStakingPoolAbi,
    provider,
  );
  const zapContract = new ethers.Contract(zapAddress, zapAbi, provider);
  const pool = await revaLpStakingPoolContract.poolInfo(poolId);
  const { allocPoint, totalSupply, lpToken } = pool;
  if (totalSupply.toString() === "0") {
    console.warn(`Total LP staked to pool id ${poolId}, returning 0% apy`);
    return 0;
  }
  const totalAllocPoint = await revaLpStakingPoolContract.totalAllocPoint();
  const revaPerBlock = await revaLpStakingPoolContract.revaPerBlock();
  const blocksPerYear = "10518975";
  const accRevaPerYear = revaPerBlock
    .mul(blocksPerYear)
    .mul(allocPoint)
    .div(totalAllocPoint);
  const accBusdPerYear = await zapContract.getBUSDValue(
    addresses.revaToken,
    accRevaPerYear,
  );
  const totalBusdStaked = await zapContract.getBUSDValue(lpToken, totalSupply);
  const revaStakeApr = accBusdPerYear
    .mul(ethers.utils.parseEther("1"))
    .div(totalBusdStaked);
  const formattedApr = ethers.utils.formatEther(revaStakeApr);
  // for percentage, multiply by 100
  return parseFloat((formattedApr * 100).toFixed(2));
}

export {
  getRevaStakingPools,
  getRevaLpStakingPools,
  getAllUserRevaStakingPoolPositions,
  getAllUserRevaLpStakingPoolPositions,
};
