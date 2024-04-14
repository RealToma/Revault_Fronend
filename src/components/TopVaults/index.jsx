import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import { VAULT_NAMES, vaultLogo } from "../../helpers/utils";

import { Root, Title, Stat } from "./index.styles";
import { colorGrayscaleOffWhite, colorSuccessDefault } from "../../colors";

export default function TopVaults({
  data,
  inBestPosition = false,
  isConnected = false,
  isCompact = false,
  isLoading = false,
  onRebalanceClick,
  onHoverStateChange,
}) {
  const vaults = data.vaults || [];
  const maxValue = _.maxBy(vaults, "apyNumeric").apyNumeric;
  const position = data.position;
  const vaultsHavePosition = data.inPosition;

  const getApyText = (vault, isFirst, isPositionInThisVault) => {
    const vaultApy = vault.apy;
    if (isCompact) {
      if (isFirst) {
        return `${
          isPositionInThisVault ? "ACTIVE" : "BEST"
        } VAULT ${vaultApy}%`;
      }
      if (vaultsHavePosition && isPositionInThisVault && !inBestPosition) {
        return `ACTIVE VAULT ${vaultApy}%`;
      }
    } else {
      if (isFirst) {
        return `BEST APY ${vaultApy}%`;
      }
      return `APY ${vaultApy}%`;
    }
    return `${vaultApy}%`;
  };

  return (
    <Root>
      <Title isCompact={isCompact}>
        {vaults.length === 1 ? "Top Vault" : `Top ${vaults.length} Vaults`}
      </Title>
      {data.vaults.map((v, index) => {
        const isFirst = index === 0;
        const isPositionInThisVault =
          vaultsHavePosition &&
          data.userVault?.additionalData?.vid === v.vaultId;
        return (
          <Stat
            key={`top-vault-${index}`}
            isCompact={isCompact}
            onMouseOver={
              onHoverStateChange ? () => onHoverStateChange(v, true) : null
            }
            onMouseOut={
              onHoverStateChange ? () => onHoverStateChange(v, false) : null
            }
          >
            {isCompact && (
              <Stat.Container.Bar.CompactLogo
                src={vaultLogo(v.details.vaultProvider, true)}
              />
            )}
            <Stat.Container
              fullWidth={
                isCompact ||
                !isConnected ||
                !position ||
                (position && inBestPosition)
              }
            >
              <Stat.Container.Bar
                percent={Math.max((v.apyNumeric / maxValue) * 100.0, 35.0)}
                isConnected={isConnected && position}
                isFirst={isFirst}
                vaultsHavePosition={vaultsHavePosition}
                vaultsHaveBestPosition={inBestPosition}
                inPosition={isPositionInThisVault}
                isCompact={isCompact}
              >
                {!isCompact && (
                  <Stat.Container.Bar.Logo
                    src={vaultLogo(v.details.vaultProvider, true)}
                  />
                )}
                <Stat.Container.Bar.Text isCompact={isCompact}>
                  {!isCompact && VAULT_NAMES[v.details.vaultProvider]}
                </Stat.Container.Bar.Text>
                <Stat.Container.APY isFirst={isFirst} isCompact={isCompact}>
                  {getApyText(v, isFirst, isPositionInThisVault)}
                </Stat.Container.APY>
              </Stat.Container.Bar>
            </Stat.Container>
            {isConnected &&
              position &&
              isFirst &&
              !isPositionInThisVault &&
              !isCompact && (
                <Stat.Rebalance
                  text="To Withdraw"
                  textColor={colorGrayscaleOffWhite}
                  backgroundColor={colorSuccessDefault}
                  loading={isLoading}
                  spinnerSize={14}
                  onClick={() =>
                    onRebalanceClick({
                      fromVaultId: position.vaultId,
                      toVaultId: v.vaultId,
                    })
                  }
                >
                  Rebalance
                </Stat.Rebalance>
              )}
          </Stat>
        );
      })}
    </Root>
  );
}

TopVaults.propTypes = {
  data: PropTypes.object,
  position: PropTypes.object,
  inBestPosition: PropTypes.bool,
  isConnected: PropTypes.bool,
  isCompact: PropTypes.bool,
  isLoading: PropTypes.bool,
  onRebalanceClick: PropTypes.func,
  onHoverStateChange: PropTypes.func,
};
