const { ethers } = require("ethers");
const { BigNumber } = require("ethers");

const { getRevaApy } = require("./revaStats");
const { getApy } = require("./apy");
const {
  generateWithdrawAllPayload,
  generateHarvestPayload,
} = require("../utils/payloads");
const { format } = require("../utils/format");
const {
  getVault,
  getVaultName,
  getVaultsByToken,
  getAllVaultTokens,
  getTokenById,
} = require("../utils/addresses.js");

const addresses = require("../../config/config").config.getNetworkAddresses();
const revaultAddress = addresses.revault;
const zapAddress = addresses.zap;
const revaChefAddress = addresses.revaChef;

/* ABI's */

const revaultAbi = require("../../abi/ReVault.json");
const zapAbi = require("../../abi/Zap.json");
const tokenAbi = require("../../abi/RevaToken.json");
const revaChefAbi = require("../../abi/RevaChef.json");

const bunnyAbi = require("../../abi/IBunnyVault.json");
const beefyAbi = require("../../abi/IBeefyVault.json");
const autofarmAbi = require("../../abi/IAutoFarm.json");

/* FUNCTIONS */

async function getAllPositions(provider) {
  const tokens = getAllVaultTokens();

  const zapContract = new ethers.Contract(zapAddress, zapAbi, provider);
  const revaChefContract = new ethers.Contract(
    revaChefAddress,
    revaChefAbi,
    provider,
  );

  let positions = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const tokenContract = new ethers.Contract(
      token.address,
      tokenAbi,
      provider,
    );
    const tokenDecimals = await tokenContract.decimals();
    const tokenInfo = await revaChefContract.tokens(token.address);
    const totalTokenPrincipal = tokenInfo.totalPrincipal;
    const tokenToBusdRate = await zapContract.getBUSDValue(
      token.address,
      BigNumber.from("10").pow(tokenDecimals),
    );
    const tvlBusd = totalTokenPrincipal
      .mul(tokenToBusdRate)
      .div(BigNumber.from("10").pow(tokenDecimals));
    const tokenVaultsFiltered = getVaultsByToken(token.symbol);
    const tokenVaults = await Promise.all(
      tokenVaultsFiltered.map(async (vault) => {
        const apy = await getApy(vault.additionalData.vid, provider);
        return {
          vaultId: vault.additionalData.vid,
          apy,
        };
      }),
    );
    const revaApy = await getRevaApy(provider, token.address);
    positions.push({
      tokenId: token.tokenId,
      vaults: tokenVaults,
      revaApy,
      tvl: ethers.utils.formatUnits(tvlBusd, tokenDecimals),
      rate: tokenToBusdRate.toString(),
    });
  }
  return positions;
}

async function getAllUserPositions(provider, userAddress) {
  const tokens = getAllVaultTokens();

  const userPositions = (
    await Promise.all(
      tokens.map((token) =>
        getUserPositions(provider, userAddress, token.tokenId),
      ),
    )
  ).filter((x) => x); // remove undefined/null
  return userPositions;
}

async function getUserPositions(provider, userAddress, tokenId) {
  const token = getTokenById(tokenId);
  const tokenContract = new ethers.Contract(token.address, tokenAbi, provider);
  const zapContract = new ethers.Contract(zapAddress, zapAbi, provider);
  const revaultContract = new ethers.Contract(
    revaultAddress,
    revaultAbi,
    provider,
  );
  const revaChefContract = new ethers.Contract(
    revaChefAddress,
    revaChefAbi,
    provider,
  );
  const tokenDecimals = (await tokenContract.decimals()).toString();
  const tokenToBusdRate = await zapContract.getBUSDValue(
    token.address,
    BigNumber.from("10").pow(tokenDecimals),
  );
  const revaToBusdRate = await zapContract.getBUSDValue(
    addresses.revaToken,
    BigNumber.from("10").pow("18").toString(),
  );
  const tokenVaultsFiltered = getVaultsByToken(token.symbol);
  const userVaults = (
    await Promise.all(
      tokenVaultsFiltered.map(async (vault) => {
        const userVaultPrincipal = await revaultContract.userVaultPrincipal(
          vault.additionalData.vid,
          userAddress,
        );
        if (userVaultPrincipal.toString() !== "0") {
          const underlyingVaultPrincipal = await getUnderlyingPrincipal(
            provider,
            userAddress,
            vault.additionalData.vid,
          );

          // there is principal in underlying vault - get full position stats
          if (
            parseFloat(
              ethers.utils.formatUnits(underlyingVaultPrincipal, tokenDecimals),
              // we don't check for principal > 0 because autofarm has a tiny remainder even when the vault is empty
            ) > 0.00000001
          ) {
            let revaFromHarvest,
              depositTokenReward,
              depositTokenReturn,
              revaFromWithdraw,
              depositTokenProfit;
            try {
              const withdrawPayload = await generateWithdrawAllPayload(
                vault.additionalData.vid,
                token.isFlip,
              );
              [depositTokenReturn, revaFromWithdraw] =
                await revaultContract.callStatic.withdrawFromVault(
                  vault.additionalData.vid,
                  withdrawPayload,
                  { from: userAddress },
                );
              depositTokenProfit = depositTokenReturn.sub(userVaultPrincipal);
              if (depositTokenProfit.lt(0)) {
                depositTokenProfit = BigNumber.from(0);
              }
              // show harvest as profit
              if (vault.vaultProvider !== "beefy") {
                const harvestPayload = await generateHarvestPayload(
                  vault.additionalData.vid,
                );
                const [depositTokenHarvest, revaTokenHarvest] =
                  await revaultContract.callStatic.harvestVault(
                    vault.additionalData.vid,
                    harvestPayload,
                    { from: userAddress },
                  );
                depositTokenReward = depositTokenHarvest;
                revaFromHarvest = revaTokenHarvest;
              } else {
                depositTokenReward = depositTokenProfit;
                revaFromHarvest = await revaChefContract.pendingReva(
                  token.address,
                  userAddress,
                );
              }
              // error getting position - return empty position
            } catch (error) {
              console.error(error.stack);
              console.log(
                `error while running static calls on vault ${getVaultName(
                  vault.additionalData.vid,
                )}`,
              );
              return {
                ...vault,
                principalNative: "0",
                principalBalanceBusd: "0",
                depositTokenReward: "0",
                depositTokenRewardBusd: "0",
                revaReward: "0",
                revaRewardBusd: "0",
                pendingProfitNative: "0",
                totalBalanceBusd: "0",
              };
            }

            const principalBalanceBusd = tokenToBusdRate
              .mul(userVaultPrincipal)
              .div(BigNumber.from("10").pow("18"));
            const depositBalanceBusd = tokenToBusdRate
              .mul(userVaultPrincipal.add(depositTokenReward))
              .div(BigNumber.from("10").pow("18"));
            const depositRewardBusd = tokenToBusdRate
              .mul(depositTokenReward)
              .div(BigNumber.from("10").pow("18"));
            const revaRewardBusd = revaToBusdRate
              .mul(revaFromWithdraw.add(revaFromHarvest))
              .div(BigNumber.from("10").pow("18"));
            const totalBalanceBusd = depositBalanceBusd.add(revaRewardBusd);
            return {
              ...vault,
              principalNative: format(userVaultPrincipal, token.decimals),
              principalBalanceBusd: format(principalBalanceBusd),
              depositTokenReward: format(depositTokenReward, token.decimals),
              depositTokenRewardBusd: format(depositRewardBusd),
              revaReward: format(revaFromWithdraw.add(revaFromHarvest)),
              revaRewardBusd: format(revaRewardBusd),
              pendingProfitNative: format(depositTokenProfit),
              totalBalanceBusd: format(totalBalanceBusd),
            };

            // vault is empty
          } else {
            return {
              ...vault,
              principalNative: "0",
              principalBalanceBusd: "0",
              depositTokenReward: "0",
              depositTokenRewardBusd: "0",
              revaReward: "0",
              revaRewardBusd: "0",
              pendingProfitNative: "0",
              totalBalanceBusd: "0",
            };
          }
        }
      }),
    )
  ).filter((x) => x);
  return {
    tokenId,
    userVaults,
  };
}

function getRevaultContract(provider) {
  return new ethers.Contract(addresses.revault, revaultAbi, provider);
}

async function getUserProxyContractAddress(provider, userAddress) {
  const revaultContract = getRevaultContract(provider);
  return revaultContract.userProxyContractAddress(userAddress);
}

function getUnderlyingVaultContract(provider, vaultId) {
  const vault = getVault(vaultId);
  if (vault.vaultProvider == "bunny") {
    return new ethers.Contract(vault.address, bunnyAbi, provider);
  } else if (vault.vaultProvider == "beefy") {
    return new ethers.Contract(vault.address, beefyAbi, provider);
  } else if (vault.vaultProvider == "autofarm") {
    return new ethers.Contract(vault.address, autofarmAbi, provider);
  }
}

async function getUnderlyingPrincipal(provider, userAddress, vaultId) {
  const userProxyContractAddress = await getUserProxyContractAddress(
    provider,
    userAddress,
  );
  const vaultContract = getUnderlyingVaultContract(provider, vaultId);
  const vault = getVault(vaultId);

  if (vault.vaultProvider == "bunny" || vault.vaultProvider == "beefy") {
    return vaultContract.balanceOf(userProxyContractAddress);
  } else if (vault.vaultProvider == "autofarm") {
    return (
      await vaultContract.userInfo(
        vault.additionalData.pid,
        userProxyContractAddress,
      )
    ).shares;
  }
}

export { getAllUserPositions, getAllPositions, getUserPositions };
