const { ethers } = require("ethers");
const formatEther = ethers.utils.formatEther;

const { config } = require("../../../config/config");
config.setEnv("mainnet");
const { getCirculatingSupply } = require("../../../apis/read/revaStats");

MAINNET_PROVIDER_URL = "https://bsc-dataseed.binance.org";                                                                              

const handler = async (event) => {
  try {

    const provider = new ethers.providers.StaticJsonRpcProvider(
      config.getProviderUrl(),
    );

    return {
      statusCode: 200,
      body: formatEther(await getCirculatingSupply(provider)),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
