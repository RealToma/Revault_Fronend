class RevaultConfig {
  LOCAL_PROVIDER_URL = "http://localhost:8545";
  LOCAL_NETWORK = "localNetwork.json";
  MAINNET_PROVIDER_URL = "https://bsc-dataseed.binance.org";
  MAINNET_NETWORK = "mainnet.json";

  constructor(env) {
    this.setEnv(env);
  }

  setEnv(env) {
    if (env === "local") {
      this._providerUrl = this.LOCAL_PROVIDER_URL;
      this._networkAddressesFile = this.LOCAL_NETWORK;
    } else if (env === "mainnet") {
      this._providerUrl = this.MAINNET_PROVIDER_URL;
      this._networkAddressesFile = this.MAINNET_NETWORK;
    } else if (env === "envvars") {
      this._providerUrl =
        process.env.REACT_APP_WEB3_PROVIDER || this.LOCAL_PROVIDER_URL;
      this._networkAddressesFile =
        process.env.REACT_APP_REVAULT_NETWORK_CONFIG || this.LOCAL_NETWORK;
    } else {
      throw new Error(`unknown config env: ${env}`);
    }

    this._env = env;
  }

  getProviderUrl() {
    return this._providerUrl;
  }

  getNetworkAddressesFile() {
    return this._networkAddressesFile;
  }

  getNetworkAddresses() {
    return require(`./${this._networkAddressesFile}`);
  }

  // temporary patch until we refactor the config file
  getSystemConfig() {
    return {
      gasEstimationMultiplier: 1.2,
      balanceRefreshDelayMs: 10000,
    };
  }
}

// Export

const config = new RevaultConfig("envvars");
export { config };
