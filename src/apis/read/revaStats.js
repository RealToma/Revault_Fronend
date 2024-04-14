const { ethers } = require("ethers");
const { BigNumber } = require("ethers");
const formatEther = ethers.utils.formatEther;
const parseEther = ethers.utils.parseEther;

const addresses = require("../../config/config").config.getNetworkAddresses();
const revaTokenAbi = require("../../abi/RevaToken.json");
const revaChefAbi = require("../../abi/RevaChef.json");
const revaStakingPoolAbi = require("../../abi/RevaStakingPool.json");
const revaLpStakingPoolAbi = require("../../abi/RevaLpStakingPool.json");
const zapAbi = require("../../abi/Zap.json");

const revaTokenAddress = addresses.revaToken;
const revaChefAddress = addresses.revaChef;
const revaStakingPoolAddress = addresses.revaStakingPool;
const revaLpStakingPoolAddress = addresses.revaLpStakingPool;
const zapAddress = addresses.zap;

const REVA_BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD";
const REVA_VESTING_ADDRESS = "0x6868E3CBc46df9F441c463cbAd8140B88fa97f9C";
const REVA_DEV_MULTISIG_ADDRESS = "0x636bf0Bd0986a1C96998f26F34b9076e113d9d48";

async function getCirculatingSupply(provider) {
  const revaTokenContract = new ethers.Contract(
    revaTokenAddress,
    revaTokenAbi,
    provider,
  );

  const totalSupply = await revaTokenContract.totalSupply();

  const vestingContractReva = await revaTokenContract.balanceOf(
    REVA_VESTING_ADDRESS,
  );
  const devMultisigContractReva = await revaTokenContract.balanceOf(
    REVA_DEV_MULTISIG_ADDRESS,
  );
  const burnedReva = await revaTokenContract.balanceOf(REVA_BURN_ADDRESS);
  const circSupply = totalSupply.sub(
    vestingContractReva.add(devMultisigContractReva).add(burnedReva),
  );

  return circSupply;
}

async function getCurrentEmissions(provider) {
  const revaChefContract = new ethers.Contract(
    revaChefAddress,
    revaChefAbi,
    provider,
  );
  const revaStakingPoolContract = new ethers.Contract(
    revaStakingPoolAddress,
    revaStakingPoolAbi,
    provider,
  );
  const revaLpStakingPoolContract = new ethers.Contract(
    revaLpStakingPoolAddress,
    revaLpStakingPoolAbi,
    provider,
  );

  const chefRevaPerBlock = await revaChefContract.revaPerBlock();
  const chefTreasuryRevaPerBlock =
    await revaChefContract.revaTreasuryPerBlock();
  const stakingRevaPerBlock = await revaStakingPoolContract.revaPerBlock();
  const stakingLpRevaPerBlock = await revaLpStakingPoolContract.revaPerBlock();
  const currEmissions = formatEther(
    chefRevaPerBlock
      .add(chefTreasuryRevaPerBlock)
      .add(stakingRevaPerBlock)
      .add(stakingLpRevaPerBlock),
  );

  return currEmissions;
}

async function getRevaStats(provider) {
  const revaTokenContract = new ethers.Contract(
    revaTokenAddress,
    revaTokenAbi,
    provider,
  );
  const revaChefContract = new ethers.Contract(
    revaChefAddress,
    revaChefAbi,
    provider,
  );

  const zapContract = new ethers.Contract(zapAddress, zapAbi, provider);
  const revaBusdPrice = await zapContract.getBUSDValue(
    revaTokenAddress,
    ethers.utils.parseEther("1"),
  );

  const totalSupply = await revaTokenContract.totalSupply();
  const maxSupply = parseEther("18181818"); // await revaTokenContract.MAX_SUPPLY();
  const currEmissions = await getCurrentEmissions(provider);
  const circSupply = await getCirculatingSupply(provider);
  const revaTvlBusd = await revaChefContract.totalRevaultTvlBusd();

  return {
    totalSupply: String(parseFloat(formatEther(totalSupply)).toFixed(0)),
    circSupply: String(parseFloat(formatEther(circSupply)).toFixed(0)),
    maxSupply: String(parseFloat(formatEther(maxSupply)).toFixed(0)),
    revaPrice: String(parseFloat(formatEther(revaBusdPrice)).toFixed(2)),
    tvl: String(parseFloat(formatEther(revaTvlBusd)).toFixed(0)),
    currEmissions: String(currEmissions),
  };
}

const blocksPerYear = BigNumber.from("10512000"); // 86400/3 * 365

async function getRevaApy(provider, tokenAddress) {
  const revaChefContract = new ethers.Contract(
    revaChefAddress,
    revaChefAbi,
    provider,
  );
  const zapContract = new ethers.Contract(zapAddress, zapAbi, provider);

  let results = await Promise.all([
    zapContract.getBUSDValue(revaTokenAddress, ethers.utils.parseEther("1")),
    revaChefContract.revaPerBlock(),
    revaChefContract.tokens(tokenAddress),
  ]);

  const revaBusdPrice = results[0];

  const revaPerBlock = results[1];

  const tokenInfo = results[2]; // revaChefContract.tokens(tokenAddress);

  const tokenLastUpdatedTvlBusd = tokenInfo.tvlBusd;
  const tokenPrincipal = tokenInfo.totalPrincipal;
  if (
    tokenLastUpdatedTvlBusd.toString() === "0" ||
    tokenPrincipal.toString() === "0"
  )
    return "0";

  results = await Promise.all([
    zapContract.getBUSDValue(tokenAddress, tokenPrincipal),
    revaChefContract.totalRevaultTvlBusd(),
  ]);

  const tokenActualTvlBusd = results[0];

  const totalLastUpdatedTvlBusd = results[1];
  const revaBusdPerYear = revaPerBlock.mul(revaBusdPrice).mul(blocksPerYear);
  const revaApy = revaBusdPerYear
    .mul(tokenLastUpdatedTvlBusd)
    .div(totalLastUpdatedTvlBusd)
    .div(tokenActualTvlBusd);
  const revaApyPercentage = formatEther(revaApy.mul(100));

  return parseFloat(revaApyPercentage).toFixed(2);
}

export { getCirculatingSupply, getCurrentEmissions, getRevaStats, getRevaApy };
