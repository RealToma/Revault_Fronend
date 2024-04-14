import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Big from "big.js";

import { TOKEN_NAMES, getTokenSymbolName } from "../../helpers/utils";
import { useHover } from "../../helpers/hooks";

import {
  Root,
  Background,
  Content,
  Title,
  ApyInfo,
  Text,
  Value,
  Optimization,
  Position,
  PlusHover,
} from "./index.styles";
import DoubleTokenBox from "../DoubleTokenBox";
import SingleTokenBox from "../SingleTokenBox";
import NumberFormatter from "../NumberFormatter";
import TopVaults from "../TopVaults";

import plusIcon from "../../assets/round_plus.png";
import { colorGrayscaleOffWhite } from "../../colors";

export default function TokenPair({
  data,
  exchangeRatesMap = {},
  isConnected,
  onEnterPosition,
}) {
  const coins = data.tokenDetails.codes;
  const topVault = useMemo(() => {
    return data.vaults[0];
  }, [data]);
  const position = data?.position;
  const inPosition = data.inPosition;
  const inBestPosition =
    data.inPosition && position.vaultId === topVault.vaultId;

  const [rootHoverRef, isRootHovered] = useHover();
  const [plusHoverRef, isPlusHovered] = useHover();

  const [hoverVault, setHoverVault] = useState();

  const updateHoverState = (vault, isOver) => {
    setHoverVault(isOver ? vault : undefined);
  };

  const revaApy = parseFloat(data.revaApy);
  const displayApy = parseFloat(hoverVault ? hoverVault.apy : topVault.apy);
  const positionTokenAmount =
    (position && data.userVault?.principalNative) || new Big(0);
  const positionBusdRate =
    exchangeRatesMap[data.tokenId]?.busdPerToken || new Big(0);

  const getPositionContent = () => {
    return (
      <Position inPosition={inPosition}>
        {inPosition ? (
          <>
            <Position.Detail>
              <span>{`${getTokenSymbolName(
                data.tokenDetails.symbol,
              )} PROFITS`}</span>
              <NumberFormatter
                value={data.userVault.depositTokenRewardBusd}
                prefix="$"
              />
            </Position.Detail>
            <Position.Detail>
              <span>REVA Profits</span>
              {data.userVault && (
                <NumberFormatter
                  value={data.userVault.revaRewardBusd}
                  prefix="$"
                />
              )}
            </Position.Detail>
            <Position.Detail style={{ color: colorGrayscaleOffWhite }}>
              <span>Position Value</span>
              {positionBusdRate.eq(0) || positionTokenAmount.eq(0) ? (
                <span>$0.000</span>
              ) : (
                <NumberFormatter
                  value={positionTokenAmount.times(positionBusdRate)}
                  prefix="$"
                />
              )}
            </Position.Detail>
          </>
        ) : (
          <>
            <Position.Left>
              <Text.M>Your Position</Text.M>
              <Value.M>
                {positionTokenAmount.eq(0) ? (
                  "0.000"
                ) : (
                  <NumberFormatter value={positionTokenAmount} />
                )}
              </Value.M>
              <Value.S>
                {positionBusdRate.eq(0) || positionTokenAmount.eq(0) ? (
                  "$0.000"
                ) : (
                  <NumberFormatter
                    value={positionTokenAmount.times(positionBusdRate)}
                    prefix="$"
                  />
                )}
              </Value.S>
            </Position.Left>
            <Position.Enter onClick={() => onEnterPosition(data)}>
              Enter Position
            </Position.Enter>
          </>
        )}
      </Position>
    );
  };

  return (
    <Root ref={rootHoverRef} onClick={() => onEnterPosition(data)}>
      <Background hovered={isRootHovered} />
      <Content>
        <Title>
          {coins.map((c) => TOKEN_NAMES[c]).join("-")}
          {coins.length > 1 ? (
            <DoubleTokenBox coins={coins} />
          ) : (
            <SingleTokenBox coin={coins[0]} />
          )}
        </Title>
        <Title.HR />
        <ApyInfo>
          <ApyInfo.Left>
            <Text.M>
              {`${
                hoverVault
                  ? hoverVault.details.vaultProvider
                  : topVault.details.vaultProvider
              } APY`}
            </Text.M>
            <Value.L style={{ marginBottom: 13 }}>{displayApy}%</Value.L>
          </ApyInfo.Left>
          <ApyInfo.Plus ref={plusHoverRef} src={plusIcon} />
          {isPlusHovered && (
            <PlusHover>
              <PlusHover.Content>
                <NumberFormatter
                  value={displayApy + revaApy}
                  suffix="% TOTAL APY"
                />
              </PlusHover.Content>
            </PlusHover>
          )}
          <ApyInfo.Right>
            <Text.M>Revault apy</Text.M>
            <Value.L style={{ paddingBottom: 13 }}>
              <NumberFormatter value={revaApy} suffix="%" />
            </Value.L>
          </ApyInfo.Right>
        </ApyInfo>
        <Optimization>
          <TopVaults
            data={data}
            position={position}
            inBestPosition={inBestPosition}
            isConnected={isConnected}
            isCompact
            onHoverStateChange={updateHoverState}
          />
        </Optimization>
        {getPositionContent()}
      </Content>
    </Root>
  );
}

TokenPair.propTypes = {
  data: PropTypes.object,
  exchangeRatesMap: PropTypes.object,
  isConnected: PropTypes.bool,
  onEnterPosition: PropTypes.func,
};
