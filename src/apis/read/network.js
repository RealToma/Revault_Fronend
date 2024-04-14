async function getGasPrice(provider, getBignumber) {
  const gp = await provider.getGasPrice();
  return getBignumber ? gp : gp.toHexString();
}

async function estimateGas(provider, tx) {
  return await provider.estimateGas(tx);
}

async function getGasLimit(provider, tx, multiplier = 1.0) {
  const estimate = await provider.estimateGas(tx);
  return Math.floor(estimate.toNumber() * multiplier);
}

export { getGasPrice, estimateGas, getGasLimit };
