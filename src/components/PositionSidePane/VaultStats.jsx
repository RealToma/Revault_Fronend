import React from "react";
import PropTypes from "prop-types";

import NumberFormatter from "../NumberFormatter";

import { vaultLogo, VAULT_NAMES } from "../../helpers/utils";

import {
  Root,
  Title,
  Stats,
  BarPrefix,
  BarSuffix,
  BarSign,
  Notice,
} from "./VaultStats.styles";
import { Stat as Styled } from "../TopVaults/index.styles";

import iconInfo from "../../assets/icon-info.png";
import iconPlus from "../../assets/icon-plus.png";
import iconEquals from "../../assets/icon-equals.png";

export default function VaultStats({
  data,
  revaApy = 0,
  isConnected,
  inBestPosition,
  inPosition,
}) {
  const vaultName = VAULT_NAMES[data.details.vaultProvider];

  const isRebalanceRequired = inPosition && !inBestPosition;

  return (
    <Root>
      <Title>
        {isRebalanceRequired ? "Active Vault" : "Best Vault"}
        <Title.Icon src={iconInfo} />
      </Title>
      <Stats>
        <Stats.Item>
          <Stats.Item.Value>{`${data.apy}%`}</Stats.Item.Value>
          {`${vaultName} APY`}
        </Stats.Item>
        <Stats.Icon src={iconPlus} />

        <Stats.Item>
          <Stats.Item.Value>
            <NumberFormatter value={revaApy} suffix="%" />
          </Stats.Item.Value>
          REVA REWARDS
        </Stats.Item>
        <Stats.Icon src={iconEquals} />
        <Stats.Item>
          <Stats.Item.Value>
            <NumberFormatter value={data.apyNumeric + revaApy} suffix="%" />
          </Stats.Item.Value>
          TOTAL APY
        </Stats.Item>
      </Stats>
      <Styled.Container.Bar
        isConnected={isConnected && inPosition}
        isFirst={isConnected ? (inPosition ? inBestPosition : true) : true}
        inPosition={inPosition}
        vaultsHavePosition={inPosition}
        vaultsHaveBestPosition={inBestPosition}
        isCompact={false}
      >
        <BarPrefix>
          <Styled.Container.Bar.Logo
            src={vaultLogo(data.details.vaultProvider, true)}
          />
          <Styled.Container.Bar.Text>{vaultName}</Styled.Container.Bar.Text>
        </BarPrefix>
        <BarSuffix isRebalanceRequired={isRebalanceRequired}>
          {`APY ${data.apy}%`}
          <BarSign isRebalanceRequired={isRebalanceRequired}>+</BarSign>
          <BarSuffix.Bkg isRebalanceRequired={isRebalanceRequired}>
            <NumberFormatter value={revaApy} prefix="REVA " suffix="%" />
          </BarSuffix.Bkg>
        </BarSuffix>
      </Styled.Container.Bar>
      {isRebalanceRequired && (
        <Notice>Rebalance required for your active vault</Notice>
      )}
    </Root>
  );
}

VaultStats.propTypes = {
  data: PropTypes.object,
  inPosition: PropTypes.bool,
  revaApy: PropTypes.number,
  isConnected: PropTypes.bool,
  inBestPosition: PropTypes.bool,
};
