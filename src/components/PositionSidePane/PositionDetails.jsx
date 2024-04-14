import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Big from "big.js";

import { formatNumericString } from "../../helpers/utils";
import ToolTip from "../ToolTip";
import NumberFormatter from "../NumberFormatter";
import { Root, Stats, ClaimButton } from "./PositionDetails.styles";
import { Divider } from "../Common.styles";
import { colorGrayscaleBody } from "../../colors";
import { orientationTop } from "../ToolTip/index.styles";
import VaultFees from "../VaultFees";

const beefyNoticeText =
  "Beefy does not support claim profits, you will claim only your pending REVA profits. in order to claim all profits use withdraw.";

export default function PositionDetails({
  data,
  vault,
  amount,
  tokenId,
  exchangeRatesMap = {},
  isRequesting,
  onClaimClick,
}) {
  const symbol = (
    vault?.depositTokenSymbol ||
    data?.depositTokenSymbol ||
    ""
  ).toUpperCase();
  const lpName = `${symbol} ${symbol.includes("-") ? " LP" : ""}`;
  const conversionRate = exchangeRatesMap[tokenId]?.busdPerToken || new Big(1);
  const amountInBusd = amount.times(conversionRate);

  const currentProfit = useMemo(() => calcCurrentProfit(vault), [vault]);
  const positionValue = useMemo(
    () => calcPositionValue(vault, conversionRate),
    [vault],
  );

  if (!vault) {
    return null;
  }

  const isBeefyProvider = vault.vaultProvider === "beefy";

  return (
    <Root>
      <Stats>
        <Stats.Row>
          <Stats.Item>
            <Stats.Item.Title>{`${lpName} Deposited`}</Stats.Item.Title>
            <Stats.Item.Value>
              <ToolTip text={`${formatNumericString(amount.toString())}`}>
                <NumberFormatter value={amount} />
              </ToolTip>
            </Stats.Item.Value>
            <Stats.Item.Subtitle>
              <NumberFormatter value={amountInBusd} prefix="$" />
            </Stats.Item.Subtitle>
            <Stats.Item.Gap />
            <Stats.Item.Title>Yield Analysis</Stats.Item.Title>
            <Stats.Item.Value
              size={16}
              style={{ color: colorGrayscaleBody, opacity: 0.4 }}
            >
              Coming Soon...
            </Stats.Item.Value>
          </Stats.Item>
          <Stats.Item.Divider />
          <Stats.Item>
            <Stats.Item.Title>{`${lpName} Profits`}</Stats.Item.Title>
            <Stats.Item.Value>
              <ToolTip text={formatNumericString(vault.depositTokenReward)}>
                <NumberFormatter value={vault.depositTokenReward} />
              </ToolTip>
            </Stats.Item.Value>
            <Stats.Item.Subtitle>
              <NumberFormatter
                value={vault.depositTokenRewardBusd}
                prefix="$"
              />
            </Stats.Item.Subtitle>
            <Stats.Item.Gap />
            <Stats.Item.Title>Current Profit</Stats.Item.Title>
            <Stats.Item.Value size={16}>
              <ToolTip
                text={`${formatNumericString(currentProfit.toString())}%`}
              >
                <NumberFormatter value={currentProfit} suffix="%" />
              </ToolTip>
            </Stats.Item.Value>
          </Stats.Item>
          <Stats.Item.Divider />
          <Stats.Item>
            <Stats.Item.Title>REVA profits</Stats.Item.Title>
            <Stats.Item.Value>
              <ToolTip text={`${formatNumericString(vault.revaReward)}`}>
                <NumberFormatter value={vault.revaReward} />
              </ToolTip>
            </Stats.Item.Value>
            <Stats.Item.Subtitle>
              <NumberFormatter value={vault.revaRewardBusd} prefix="$" />
            </Stats.Item.Subtitle>
            <Stats.Item.Gap />
            <Stats.Item.Title>Total Value</Stats.Item.Title>
            <Stats.Item.Value size={16}>
              <ToolTip
                text={`$${formatNumericString(positionValue.toString())}`}
              >
                <NumberFormatter value={positionValue} prefix="$" />
              </ToolTip>
            </Stats.Item.Value>
          </Stats.Item>
        </Stats.Row>
      </Stats>
      <ToolTip
        orientation={orientationTop}
        text={isBeefyProvider ? beefyNoticeText : ""}
        style={{ display: "flex" }}
      >
        <ClaimButton
          text={isBeefyProvider ? "Claim REVA Profits" : "Claim Profits"}
          loading={isRequesting}
          loadingText="Claiming..."
          onClick={onClaimClick}
        />
      </ToolTip>
      <Divider style={{ marginTop: 15, marginBottom: 15 }} />
      <VaultFees vaultId={vault.additionalData?.vid} />
    </Root>
  );
}

function calcCurrentProfit(vault) {
  if (!vault) {
    return new Big(0);
  }
  const principalBalance = vault.principalBalanceBusd || new Big(0);
  const profit = principalBalance
    .plus(vault.depositTokenRewardBusd || 0)
    .plus(vault.revaRewardBusd || 0);
  return profit.gt(0)
    ? profit.div(principalBalance).times(100).minus(100)
    : new Big(0);
}

function calcPositionValue(vault, rate = new Big(1)) {
  if (!vault) {
    return new Big(0);
  }

  const principalNativeBusd = (vault.principalNative || new Big(0)).times(rate);
  const pendingProfitNativeBusd = (
    vault.pendingProfitNative || new Big(0)
  ).times(rate);
  return principalNativeBusd
    .plus(pendingProfitNativeBusd)
    .plus(vault.revaRewardBusd);
}

PositionDetails.propTypes = {
  data: PropTypes.object,
  vault: PropTypes.object,
  amount: PropTypes.instanceOf(Big),
  tokenId: PropTypes.number,
  exchangeRatesMap: PropTypes.object,
  isRequesting: PropTypes.bool,
  onClaimClick: PropTypes.func,
};
