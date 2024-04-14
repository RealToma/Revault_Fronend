import React, { useState } from "react";
import PropTypes from "prop-types";
import Big from "big.js";
import usePortal from "react-cool-portal";
import { useSelector } from "react-redux";
import { getTokenSymbolName } from "../../helpers/utils";
import AssetView from "../AssetView";
import TokenSelect from "../TokenSelect";

import { Root, Arrow, Notice, Rate } from "./ExchangeView.styles";
import { VerticalSpacer } from "../Common.styles";

import iconArrow from "../../assets/icon-arrow-down-circle.png";

export default function ExchangeView({
  data,
  exchangeOriginTokenId,
  exchangeOriginAmount,
  onExchangeOriginTokenSelected,
  onExchangeOriginAmountChanged,
  onCancel,
}) {
  const { Portal, show, hide } = usePortal({
    defaultShow: true,
    clickOutsideToHide: false,
  });
  const [exchangeOriginBUSDValue, setExchangeOriginBUSDValue] = useState();

  const vaultsState = useSelector((state) => state.vaultsState);
  const exchangeRatesMap = vaultsState.data.exchangeRatesMap;
  const tokenSymbolMap = vaultsState.data.tokenSymbolMap;
  const allUserTokens = vaultsState.data.allUserTokens || [];
  const exchangeOriginToken = allUserTokens.find(
    (token) => token.tokenId === exchangeOriginTokenId,
  );
  const tokenSymbolName = getTokenSymbolName(data.tokenDetails?.symbol);

  const handleTokenSelected = (token) => {
    onExchangeOriginTokenSelected(token.tokenId);
    setExchangeOriginBUSDValue();
    hide();
  };

  const originTokenBalance = `${
    exchangeOriginToken?.balance || exchangeOriginToken?.tokenBalance || 0
  }`;

  return (
    <>
      <Root>
        {exchangeOriginToken && (
          <>
            <AssetView
              tokenDetails={exchangeOriginToken.tokenDetails}
              exchangeRatesMap={exchangeRatesMap}
              busdPerToken={
                exchangeRatesMap[exchangeOriginToken.tokenId].busdPerToken
              }
              balance={originTokenBalance}
              amountText={exchangeOriginAmount}
              useMax={new Big(originTokenBalance || 0).gt(0)}
              assetNumber="1"
              onToggleClick={() => show()}
              tokenSymbolMap={tokenSymbolMap}
              onValueChange={(amount, busdValue) => {
                onExchangeOriginAmountChanged(amount);
                setExchangeOriginBUSDValue(busdValue);
              }}
            />
            <Arrow src={iconArrow} />
            <AssetView
              tokenDetails={data.tokenDetails}
              balance={`${data.balance || data.tokenBalance || 0}`}
              busdPerToken={exchangeRatesMap[data.tokenId].busdPerToken}
              assetNumber="2"
              isDisabled={true}
              exchangeText={exchangeOriginBUSDValue}
              tokenSymbolMap={tokenSymbolMap}
            />
            <Notice>*Estimated conversion rate</Notice>
            <VerticalSpacer />
            {exchangeOriginToken && (
              <Rate>
                <Rate.Title>RATE</Rate.Title>
                {`1 ${tokenSymbolName} = $${exchangeRatesMap[
                  data.tokenId
                ].busdPerToken
                  .round(2)
                  .toString()}`}
              </Rate>
            )}
          </>
        )}
      </Root>
      <Portal>
        <TokenSelect
          data={vaultsState.data.allUserTokens}
          sourceTokenId={data.tokenId}
          onTokenSelected={handleTokenSelected}
          onClose={() => {
            if (!exchangeOriginToken) {
              onCancel();
            }
            hide();
          }}
        />
      </Portal>
    </>
  );
}

ExchangeView.propTypes = {
  data: PropTypes.object,
  exchangeOriginTokenId: PropTypes.number,
  exchangeOriginAmount: PropTypes.string,
  onExchangeOriginTokenSelected: PropTypes.func,
  onExchangeOriginAmountChanged: PropTypes.func,
  onCancel: PropTypes.func,
};
