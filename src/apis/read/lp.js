const { ethers } = require("ethers");

const addresses = require("../../config/config").config.getNetworkAddresses();

/* ABI's */

const pancakeFactoryAbi = require("../../abi/IPancakeFactory.json");
const pancakePairAbi = require("../../abi/IPancakePair.json");

/* FUNCTIONS */

// Get

async function getPancakePair(provider, token0, token1) {
  const pancakeFactoryContract = new ethers.Contract(
    addresses.pancakeswap.factory,
    pancakeFactoryAbi,
    provider,
  );
  const pairAddress = await pancakeFactoryContract.getPair(
    token0.address,
    token1.address,
  );

  const pairContract = new ethers.Contract(
    pairAddress,
    pancakePairAbi,
    provider,
  );

  return pairContract;
}

async function getLpPoolReserves(provider, token0, token1) {
  const pairContract = await getPancakePair(provider, token0, token1);

  let token0symbol = token0.symbol;
  let token1symbol = token1.symbol;
  if ((await pairContract.token0()) == token1.address) {
    token0symbol = token1.symbol;
    token1symbol = token0.symbol;
  }

  const [amount0, amount1] = await pairContract.getReserves();
  return { token0symbol, amount0, token1symbol, amount1 };
}

async function getLiquidityRatio(provider, token0, token1, amount, precision) {
  const pairContract = await getPancakePair(provider, token0, token1);
  const totalSupply = await pairContract.totalSupply();
  const { amount0, amount1 } = await getLpPoolReserves(
    provider,
    token0,
    token1,
  );

  amount = amount || 1;
  precision = precision || 2;
  const multiplier = Math.pow(10, precision);

  const portion0 =
    amount0.mul(multiplier).div(totalSupply).toNumber() / multiplier;
  const portion1 =
    amount1.mul(multiplier).div(totalSupply).toNumber() / multiplier;

  return { portion0, portion1 };
}

/* EXPORT */

export { getPancakePair, getLpPoolReserves, getLiquidityRatio };
