import React from "react";
import PropTypes from "prop-types";
import Big from "big.js";
import _ from "lodash";

import CompactTokenBox from "../CompactTokenBox";
import NumberFormatter from "../NumberFormatter";

import { Root, FrameLeft, FrameRight, StyledLink } from "./index.styles";

import { DECIMAL_LIMIT } from "../../constants";

import iconChevron from "../../assets/chevron-down.png";
import iconExternalLink from "../../assets/icon-external-link.png";
import { useState } from "react";

const INITIAL_INPUT = "0.000";

export default function AssetView({
  tokenDetails,
  exchangeText,
  balance = new Big(0),
  amountText,
  busdPerToken,
  leftFrameTitle,
  assetTitle,
  assetSubtitle,
  assetNumber = "",
  rightFrameTitle,
  isDisabled = false,
  useMax = false,
  onToggleClick,
  onValueChange,
  balancePrecentageShortcutsConfig,
  tokenSymbolMap,
}) {
  if (_.isString(balance)) {
    balance = new Big(balance);
  }
  const amount = new Big(amountText || 0);
  const exchange = new Big(exchangeText || 0);

  const inputAmount =
    exchangeText && !_.isNil(busdPerToken)
      ? exchange.div(busdPerToken).toString()
      : amountText;
  const showPrecentsBtns = balancePrecentageShortcutsConfig !== undefined;
  const [activePrecentButton, setActivePrecentButton] = useState(undefined);

  const getFiatSumText = () => {
    if (activePrecentButton) {
      return precantageOfBalance(
        balance.times(busdPerToken),
        activePrecentButton,
      );
    } else if (exchange?.gt(0)) {
      return exchange;
    }
    return amount.gt(0) && !_.isNil(busdPerToken)
      ? amount.times(busdPerToken)
      : null;
  };

  const precantageOfBalance = (balance, index) => {
    const precentageShortcutValue =
      index > -1 && balancePrecentageShortcutsConfig
        ? balancePrecentageShortcutsConfig[index].value
        : 100;
    return balance.times(precentageShortcutValue / 100);
  };

  const onPrecentButtonClick = (index) => {
    setActivePrecentButton(index);
    const newAmount = precantageOfBalance(balance, index);
    onValueChange(!newAmount.eq(0) ? getNormalizedValue(newAmount) : undefined);
  };

  const depositMax = (e) => {
    e.stopPropagation();
    if (onValueChange && balance && busdPerToken) {
      onValueChange(balance.toString(), balance.times(busdPerToken).toString());
    }
  };

  return (
    <Root>
      <FrameLeft>
        <FrameLeft.Title>
          {leftFrameTitle || `Asset ${assetNumber}`}
          {onToggleClick && (
            <FrameLeft.Title.Toggle src={iconChevron} onClick={onToggleClick} />
          )}
        </FrameLeft.Title>
        <FrameLeft.Details>
          <CompactTokenBox tokens={tokenDetails.codes} />
          <FrameLeft.Details.Text>
            <FrameLeft.Details.Text.Title>
              {assetTitle || tokenTitle(tokenDetails)}
            </FrameLeft.Details.Text.Title>
            <FrameLeft.Details.Text.Subtitle>
              {assetSubtitle || tokenSubtitle(tokenDetails, tokenSymbolMap)}
            </FrameLeft.Details.Text.Subtitle>
          </FrameLeft.Details.Text>
        </FrameLeft.Details>
      </FrameLeft>
      <FrameRight>
        <FrameRight.TopBar>
          <FrameRight.Title>
            {rightFrameTitle || getMaxComponent(useMax, depositMax)}
          </FrameRight.Title>
          {showPrecentsBtns ? (
            <FrameRight.PrecentageButtons>
              {balancePrecentageShortcutsConfig?.map(({ value }, index) => {
                return (
                  <FrameRight.PrecentageButton
                    key={value + "%"}
                    onClick={() => onPrecentButtonClick(index)}
                    active={index === activePrecentButton}
                  >
                    {value + "%"}
                  </FrameRight.PrecentageButton>
                );
              })}
            </FrameRight.PrecentageButtons>
          ) : (
            <FrameRight.Balance onClick={depositMax}>
              <NumberFormatter prefix="Balance: " value={balance} />
            </FrameRight.Balance>
          )}
        </FrameRight.TopBar>
        <FrameRight.TokenSum
          $overLimit={amount.gt(balance)}
          placeholder={INITIAL_INPUT}
          disabled={isDisabled}
          value={inputAmount}
          allowNegativeValue={false}
          allowDecimals
          decimalsLimit={20}
          onValueChange={(value) => {
            if (value) {
              setActivePrecentButton(undefined);
              const numericValue =
                value?.length > 0 ? new Big(value) : undefined;
              const finalValue =
                numericValue && !_.isNil(busdPerToken)
                  ? numericValue.times(busdPerToken)
                  : new Big(0);
              onValueChange(getNormalizedValue(value), finalValue.toString()); // 2 arguments used in a custom function in ExchangeView.jsx, the rest use only the first one
            } else {
              onValueChange();
            }
          }}
        />
        <FrameRight.FiatSum $overLimit={amount.gt(balance)}>
          {getFiatSumText() && (
            <NumberFormatter value={getFiatSumText()} prefix="$" />
          )}
        </FrameRight.FiatSum>
      </FrameRight>
    </Root>
  );
}

function tokenTitle(details = {}) {
  const name = details.symbol?.toUpperCase() || "";
  if (details.codes?.length > 1) {
    return `${name} LP`;
  }
  return name;
}

function tokenSubtitle(details = {}, tokenSymbolMap) {
  if (details.codes?.length > 1) {
    if (tokenSymbolMap) {
      return (
        <StyledLink
          target="_blank"
          rel="noopener noreferrer"
          href={getPSLink(details.symbol, tokenSymbolMap)}
        >
          {`${details.symbol.toUpperCase()} LP`}
          <StyledLink.Icon src={iconExternalLink} />
        </StyledLink>
      );
    }
    return "LP Token";
  }
  return "Token";
}

function getMaxComponent(useMax, onClick) {
  if (useMax) {
    return (
      <FrameRight.Balance.Max onClick={onClick}>MAX</FrameRight.Balance.Max>
    );
  }
  return null;
}

function getPSLink(symbol = "", tokenSymbolMap = {}) {
  const symbolSplit = symbol.split("-");
  return `https://pancakeswap.finance/add/${
    tokenSymbolMap[symbolSplit[0]]?.address || ""
  }/${tokenSymbolMap[symbolSplit[1]]?.address || ""}`;
}

function getNormalizedValue(value) {
  if (_.isEmpty(value)) {
    return value;
  }
  const bigValue = new Big(value);
  const valueString = _.isString(value) ? value : bigValue.toString();
  if (valueString.includes(".") && !valueString.endsWith(".")) {
    const valueSplit = valueString.split(".");
    if (valueSplit.length === 2 && valueSplit[1].length > DECIMAL_LIMIT) {
      return bigValue.round(DECIMAL_LIMIT, Big.roundDown).toString();
    }
  }
  return value;
}

AssetView.propTypes = {
  tokenDetails: PropTypes.object,
  exchangeText: PropTypes.string,
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Big)]),
  amountText: PropTypes.string,
  busdPerToken: PropTypes.object,
  leftFrameTitle: PropTypes.string,
  assetTitle: PropTypes.string,
  assetSubtitle: PropTypes.string,
  assetNumber: PropTypes.string,
  rightFrameTitle: PropTypes.node,
  isDisabled: PropTypes.bool,
  useMax: PropTypes.bool,
  onToggleClick: PropTypes.func,
  onValueChange: PropTypes.func,
  balancePrecentageShortcutsConfig: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.number }),
  ),
  tokenSymbolMap: PropTypes.object,
};
