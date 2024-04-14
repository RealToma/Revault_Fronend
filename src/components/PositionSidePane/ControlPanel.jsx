import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Big from "big.js";

import { getTokenSymbolName } from "../../helpers/utils";
import { useHover } from "../../helpers/hooks";
import { useSelector } from "react-redux";
import { useSpring, animated } from "@react-spring/web";
import { easeExpOut } from "d3-ease";
import ReactTooltip from "react-tooltip";

import ExchangeView from "./ExchangeView";
import PositionDetails from "./PositionDetails";
import AssetView from "../AssetView";
import NumberFormatter from "../NumberFormatter";
import { ControlMode as Mode } from "./index";

import { config } from "../../config/config";

import {
  Root,
  HoverArea,
  Title,
  ButtonContainer,
  ButtonSpacer,
  ActionButton,
  AltButton,
} from "./ControlPanel.styles";
import { Divider, VerticalSpacer } from "../Common.styles";
import { colorGrayscalePlaceholder, colorPrimaryDefault } from "../../colors";

import iconChevronUp from "../../assets/chevron-up-white.png";
import iconChevronDown from "../../assets/chevron-down.png";
import iconX from "../../assets/icon-x.png";
import VaultFees from "../VaultFees";

const depositTooltipId = "deposit-tokens-tooltip";

export default function ControlPanel({
  data,
  position,
  mode,
  inPosition,
  isConnected,
  isExpanded,
  inBestPosition,
  loadingStates,
  onConnectClick,
  onDepositClick,
  onWithdrawClick,
  onClaimClick,
  onExpandedChanged,
  onModeChange,
  onApproveClick,
}) {
  const [rootHoverRef, isRootHovered] = useHover();

  const vaultsState = useSelector((state) => state.vaultsState);
  const exchangeRatesMap = vaultsState?.data?.exchangeRatesMap;

  const [originTokenId, setOriginTokenId] = useState();
  const [originAmount, setOriginAmount] = useState();

  const props = useSpring({
    height: isExpanded ? 527 : 130,
    config: { duration: 400, easing: easeExpOut },
  });

  useEffect(() => {
    setOriginTokenId();
    setOriginAmount();
  }, [mode]);

  useEffect(() => {
    if (isRootHovered && isConnected) {
      onExpandedChanged(true);
    }
  }, [isRootHovered, isConnected]);

  const positionTokenAmount =
    (position && data.userVault?.principalNative) || new Big(0);
  const tokenSymbolMap = vaultsState.data.tokenSymbolMap;
  const tokenSymbol = data.tokenDetails?.symbol?.toUpperCase() || "";
  const tokenSymbolName = getTokenSymbolName(tokenSymbol);
  const allUserTokens = vaultsState.data.allUserTokens || [];
  const isExchange = originTokenId !== undefined;
  const originToken = allUserTokens.find(
    (token) => token.tokenId === originTokenId,
  );
  const approvedRevault = data.tokenDetails?.approvedRevault || false;
  const approvedZapAndDeposit = originToken?.approvedZapAndDeposit || false;

  const getTitle = () => {
    let titleText = "Enter Position";
    let suffixComponent = "";
    if (isConnected) {
      switch (mode) {
        case Mode.DETAILS:
          titleText = "Your Position";
          suffixComponent = (
            <NumberFormatter
              value={positionTokenAmount}
              suffix={` ${data.tokenDetails.symbol.toUpperCase()}`}
            />
          );
          break;
        case Mode.DEPOSIT:
          if (inPosition) {
            titleText = "Deposit";
          }
          break;
        case Mode.WITHDRAW:
          titleText = "Withdraw";
          break;
        case Mode.EXCHANGE:
          titleText = "Enter Position via Zap";
          break;
        default:
          if (inPosition) {
            titleText = "Your Position";
          }
          break;
      }
    } else {
      suffixComponent = `${data.tokenBalance.toFixed(2)} ${tokenSymbol}`;
    }

    return (
      <Title>
        {titleText}
        <Title.Suffix isHighlighted={data.tokenBalance.gt(0)}>
          {isExpanded ? suffixComponent : "Open"}
          <Title.Close
            src={isExpanded ? iconChevronUp : iconChevronDown}
            onClick={() => {
              onExpandedChanged(false);
            }}
            css="transition: transform 0.2s ease-in-out; :hover{transform: rotate(180deg);}"
          />
        </Title.Suffix>
      </Title>
    );
  };

  const getContent = () => {
    if (isExpanded) {
      switch (mode) {
        case Mode.DEPOSIT:
          return (
            <div>
              <AssetView
                tokenDetails={data.tokenDetails}
                busdPerToken={exchangeRatesMap[data.tokenId].busdPerToken}
                balance={data.tokenBalance}
                amountText={originAmount}
                isDisabled={data.tokenBalance.eq(0)}
                useMax={data.tokenBalance.gt(0)}
                tokenSymbolMap={tokenSymbolMap}
                onValueChange={(amount) => {
                  setOriginAmount(amount);
                }}
              />
              <AltButton
                width="unset"
                flex="unset"
                style={{ marginTop: 15 }}
                onClick={() => onModeChange(Mode.EXCHANGE)}
              >{`Get ${data.tokenDetails.symbol.toUpperCase()}${
                data.tokenDetails.isFlip ? " LP " : " "
              }via Zap`}</AltButton>
              <VerticalSpacer />
              <Divider style={{ marginTop: 15, marginBottom: 15 }} />
              <VaultFees vaultId={data.vaults[0].vaultId} />
            </div>
          );
        case Mode.WITHDRAW: {
          return (
            <>
              <AssetView
                tokenDetails={data.tokenDetails}
                busdPerToken={exchangeRatesMap[data.tokenId].busdPerToken}
                balance={positionTokenAmount}
                useMax={positionTokenAmount > 0}
                amountText={originAmount}
                isDisabled={positionTokenAmount <= 0}
                tokenSymbolMap={tokenSymbolMap}
                onValueChange={(amount) => {
                  setOriginAmount(amount);
                }}
              />
              <VerticalSpacer />
            </>
          );
        }
        case Mode.EXCHANGE:
          return (
            <ExchangeView
              data={data}
              exchangeOriginTokenId={originTokenId}
              exchangeOriginAmount={originAmount}
              onExchangeOriginTokenSelected={(tokenId) => {
                setOriginAmount("");
                setOriginTokenId(tokenId);
              }}
              onExchangeOriginAmountChanged={(amount) =>
                setOriginAmount(amount)
              }
              onCancel={() => onModeChange(Mode.DEPOSIT)}
            />
          );
        case Mode.DETAILS:
          return (
            <PositionDetails
              data={position}
              tokenId={data.tokenId}
              vault={data.userVault}
              amount={positionTokenAmount}
              exchangeRatesMap={exchangeRatesMap}
              isRequesting={
                loadingStates.isRefreshing || loadingStates.isClaiming
              }
              isExpanded={isExpanded}
              onClaimClick={() => onClaimClick({ vaultId: position.vaultId })}
            />
          );
      }
    }
    return null;
  };

  const getButtons = () => {
    if (isConnected) {
      switch (mode) {
        case Mode.DETAILS:
          return (
            <>
              <AltButton
                text="To Withdraw"
                textColor={colorPrimaryDefault}
                outline
                onClick={() => onModeChange(Mode.WITHDRAW)}
              />
              <ButtonSpacer />
              <ActionButton
                data-for={depositTooltipId}
                data-tip="Rebalance is requiered in order to deposit more"
                text="Deposit More"
                loading={
                  loadingStates.isRefreshing || loadingStates.isDepositing
                }
                loadingText="Depositing..."
                onClick={() => onModeChange(Mode.DEPOSIT)}
              />
              <ReactTooltip
                id={depositTooltipId}
                effect="solid"
                place="top"
                disable={inBestPosition}
                backgroundColor={colorGrayscalePlaceholder}
              />
            </>
          );
        case Mode.DEPOSIT:
          return (
            <>
              {inPosition && (
                <>
                  <AltButton
                    width={60}
                    flex={"unset"}
                    onClick={() => onModeChange(Mode.DETAILS)}
                  >
                    <AltButton.Icon src={iconX} />
                  </AltButton>
                  <ButtonSpacer />
                </>
              )}
              <ActionButton
                text={
                  approvedRevault ? "Deposit" : `Approve ${tokenSymbolName}`
                }
                loading={
                  loadingStates.isRefreshing ||
                  loadingStates.isDepositing ||
                  (!approvedRevault && loadingStates.isApprovingToken)
                }
                loadingText={approvedRevault ? "Depositing..." : "Approving..."}
                onClick={handleDepositClick}
                disabled={data?.tokenBalance.lt(originAmount || 0)}
              />
            </>
          );
        case Mode.WITHDRAW:
          return (
            <>
              <AltButton
                loading={
                  loadingStates.isRefreshing || loadingStates.isWithdrawing
                }
                text="Withdraw"
                loadingText="Withrawing..."
                onClick={handleWithdrawClick}
              />
              <ButtonSpacer />
              <AltButton
                width={60}
                flex={"unset"}
                onClick={() => onModeChange(Mode.DETAILS)}
              >
                <AltButton.Icon src={iconX} />
              </AltButton>
            </>
          );
        case Mode.EXCHANGE:
          return (
            <>
              <AltButton
                width={60}
                flex="unset"
                onClick={() => onModeChange(Mode.DEPOSIT)}
              >
                <AltButton.Icon src={iconX} />
              </AltButton>
              <ButtonSpacer />
              <ActionButton
                text={
                  approvedZapAndDeposit
                    ? "Zap & Deposit"
                    : `Approve ${getTokenSymbolName(
                        originToken?.tokenDetails?.symbol,
                      )}`
                }
                loading={
                  loadingStates.isRefreshing ||
                  loadingStates.isZapping ||
                  (!approvedZapAndDeposit && loadingStates.isApprovingToken)
                }
                loadingText={
                  approvedZapAndDeposit
                    ? "Zapping & Depositing..."
                    : "Approving..."
                }
                onClick={handleDepositClick}
              />
            </>
          );
      }
    }
    return <ActionButton onClick={onConnectClick}>Connect Wallet</ActionButton>;
  };

  const handleDepositClick = () => {
    if (isExchange && !approvedZapAndDeposit) {
      onApproveClick({
        tokenAddress: originToken?.tokenDetails.address,
        targetAddress: config.getNetworkAddresses().zapAndDeposit,
      });
    } else if (!isExchange && !approvedRevault) {
      onApproveClick({
        tokenAddress: data.tokenDetails.address,
        targetAddress: config.getNetworkAddresses().revault,
      });
    } else {
      if (!new Big(originAmount || 0).gt(0)) {
        return;
      }
      onDepositClick({
        amount: originAmount,
        fromTokenId: isExchange ? originTokenId : undefined,
        toVaultId: isExchange
          ? position?.vaultId || data.vaults[0].vaultId
          : undefined,
        vaultId: position?.vaultId || data.vaults[0].vaultId,
        isExchange,
      });
    }
  };

  const handleWithdrawClick = () => {
    onWithdrawClick({
      amount: originAmount,
      fromVaultId: position.vaultId,
      isMax: originAmount === positionTokenAmount.toString(),
    });
  };

  return (
    <Root
      onClick={
        (e) =>
          e.stopPropagation() /* preventing the content behind this component from being clicked */
      }
    >
      <animated.div className="container" style={props}>
        {getTitle()}
        {getContent()}
      </animated.div>
      <ButtonContainer>{getButtons()}</ButtonContainer>
      {isConnected && <HoverArea ref={rootHoverRef} isExpanded={isExpanded} />}
    </Root>
  );
}

ControlPanel.propTypes = {
  data: PropTypes.object,
  position: PropTypes.object,
  mode: PropTypes.string,
  isConnected: PropTypes.bool,
  isExpanded: PropTypes.bool,
  inPosition: PropTypes.bool,
  inBestPosition: PropTypes.bool,
  loadingStates: PropTypes.shape({
    isRefreshing: PropTypes.bool,
    isDepositing: PropTypes.bool,
    isZapping: PropTypes.bool,
    isWithdrawing: PropTypes.bool,
    isRebalancing: PropTypes.bool,
    isClaiming: PropTypes.bool,
    isApprovingToken: PropTypes.bool,
  }).isRequired,
  onConnectClick: PropTypes.func,
  onDepositClick: PropTypes.func,
  onWithdrawClick: PropTypes.func,
  onClaimClick: PropTypes.func,
  onExpandedChanged: PropTypes.func,
  onModeChange: PropTypes.func,
  onApproveClick: PropTypes.func,
};
