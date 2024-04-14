import React, { useState } from "react";
import { useMetamask } from "use-metamask";
import PropTypes from "prop-types";
import ContentLoader from "react-content-loader";

import Header from "@components/Header";
import Tabs from "@components/Tabs";
import {
  ActionButton,
  ActionButtons,
  Root,
  InlineText,
} from "../common/styles.js";
import { Title } from "@components/TokenPair/index.styles";
import AssetView from "@components/AssetView";
import { Subtitle } from "@components/TokenSelect/TokenCard.styles";
import {
  colorGrayscaleTitleActive,
  colorGrayscaleBody,
  colorPrimaryDefault,
  colorGrayscaleDark,
  colorGrayscaleOffWhite,
} from "@src/colors";
import styled from "styled-components";
import Divider from "@components/Divider";
import InfoItem from "@components/InfoItem";
import { Link } from "react-router-dom";
import LoadingSpinner from "@components/LoadingSpinner";
import { FlexContainer } from "../../components/BasicStyled";
import * as coinTypes from "@src/constants";
import { QUERY_KEYS } from "@src/constants";
import DoubleTokenBox from "@components/DoubleTokenBox";
import { numberWithCommas } from "@src/helpers/utils";
import ModalConnect from "@components/ModalConnect";
import { ReactComponent as GoToIcon } from "@src/assets/icons/icons8-external-link.svg";
import {
  claimRevaLP,
  fetchRevaLPStakingPools,
  depositRevaLP,
  fetchLiquidityRatio,
  fetchRevaLPBalance,
  fetchUserRevaLpStakingPoolPositions,
  withdrawRevaLP,
} from "@src/sagas/farming";
import { fetchTokenToBusdRate } from "@src/sagas/rates";
import { useMutation, useQuery } from "react-query";
import { getToken } from "@src/apis/utils/addresses";
import { useQueryClient } from "react-query";
import { onTransaction } from "../../utils";
import { PANCAKESWAP_ADD_BNB_URL } from "../../constants/index.js";
import {
  useApproveToken,
  useIsTokenApproved,
} from "../../hooks/approveToken.hooks";
import { config } from "../../config/config";
import Big from "big.js";
import { ActionButton as ConnectWalletButton } from "@components/PositionSidePane/ControlPanel.styles";
import NumberFormatter from "../../components/NumberFormatter.jsx";
const addresses = config.getNetworkAddresses();

export const FarmingModes = Object.freeze({
  Deposit: "Deposit",
  Withdraw: "Withdraw",
});

export default function FarmingScreen() {
  const { metaState } = useMetamask();
  const isConnected = metaState.isConnected;

  return (
    <Root>
      <Header isConnected={metaState.isConnected} />

      <div>
        <PageTitle>Earn REVA as Liquidity Provider</PageTitle>
        <PageSubtitle>
          Maximize your REVA rewards by providing liquidity via pancakeswap and
          deposit your REVA-BNB LP tokens
        </PageSubtitle>
      </div>
      <StakingTabs>
        <Tabs
          tabs={[
            {
              title: FarmingModes.Deposit + " LP Tokens",
              disabled: !isConnected,
            },
            {
              title: FarmingModes.Withdraw + " LP Tokens",
              disabled: !isConnected,
            },
          ]}
          panels={[
            <ContentPanel
              key={FarmingModes.Deposit}
              content={{ type: FarmingModes.Deposit }}
              isConnected={metaState.isConnected}
            />,
            <ContentPanel
              key={FarmingModes.Withdraw}
              content={{ type: FarmingModes.Withdraw }}
              isConnected={metaState.isConnected}
            />,
          ]}
        />
      </StakingTabs>
    </Root>
  );
}

function ContentPanel({ content, isConnected }) {
  const [amount, setAmount] = useState();
  const doubleTokenSymbol = "REVA-BNB";
  const queryClient = useQueryClient();

  let {
    isLoading: isLPPoolPositionsLoading,
    data: lpPoolPositions = [{ pendingReva: new Big(0), lpStaked: new Big(0) }],
  } = useQuery(QUERY_KEYS.revaLPPoolPositions, async () => {
    const pools = await fetchUserRevaLpStakingPoolPositions({
      userAddress: window.ethereum.selectedAddress,
    });
    return pools;
  });

  let {
    isLoading: isLPPoolsLoading,
    data: lpPools = [{ apy: 0, totalLpStaked: 0 }],
  } = useQuery(QUERY_KEYS.revaLPPool, async () => {
    const pools = await fetchRevaLPStakingPools();
    return pools;
  });

  let {
    isLoading: isLiquidityRatioLoading,
    data: liquidityRatio = { portion0: 0, portion1: 0 },
  } = useQuery(QUERY_KEYS.revaLpLiquidityRatio, async () => {
    const pools = await fetchLiquidityRatio({
      firstTokenSymbol: "reva",
      secondTokenSymbol: "bnb",
    });
    return pools;
  });

  let { isLoading: isBalanceLoading, data: balance } = useQuery(
    QUERY_KEYS.revaBNBLP,
    async () => {
      if (!isConnected) {
        return;
      }

      const balance = await fetchRevaLPBalance({
        userAddress: window.ethereum.selectedAddress,
      });
      return balance;
    },
    {
      refetchInterval: 3000,
    },
  );

  let { isLoading: isBusdRateLoading, data: busdRate = new Big(0) } = useQuery(
    QUERY_KEYS.revaBNBToBusdRate,
    async () => {
      const { tokenId } = getToken(doubleTokenSymbol);
      const busdRate = await fetchTokenToBusdRate({ tokenId });
      return busdRate;
    },
  );

  const queriesToRefetch = [
    QUERY_KEYS.revaLPPoolPositions,
    QUERY_KEYS.revaLPPool,
    QUERY_KEYS.revaBNBLP,
    QUERY_KEYS.revaLpLiquidityRatio,
  ];

  const { revaLpStakingPool } = addresses;
  const { data: isRevaLpTokenApproved } = useIsTokenApproved({
    tokenAddress: addresses["reva-bnb"],
    targetAddress: revaLpStakingPool,
  });
  const { mutate: approveRevaLpToken, isLoading: isApprovingRevaLpToken } =
    useApproveToken({
      params: {
        tokenAddress: addresses["reva-bnb"],
        targetAddress: revaLpStakingPool,
      },
    });

  const depositMutation = useMutation(
    () => {
      return depositRevaLP({
        poolId: 0,
        amount,
      });
    },
    {
      onSuccess: (txHash) =>
        onTransaction({
          txHash,
          callback: () => queryClient.refetchQueries(queriesToRefetch),
        }),
    },
  );

  const withdrawMutation = useMutation(
    () => {
      return withdrawRevaLP({ poolId: 0, amount });
    },
    {
      onSuccess: (txHash) =>
        onTransaction({
          txHash,
          callback: () => queryClient.refetchQueries(queriesToRefetch),
        }),
    },
  );

  const claimMutation = useMutation(
    ({ poolId }) => {
      return claimRevaLP({ poolId });
    },
    {
      onSuccess: (txHash) =>
        onTransaction({
          txHash,
          callback: () => queryClient.refetchQueries(queriesToRefetch),
        }),
    },
  );

  const onClaim = () => {
    return claimMutation.mutate({ poolId: 0 });
  };

  const onDeposit = () => {
    return depositMutation.mutate({ poolId: 0 });
  };

  const onWithdraw = () => {
    return withdrawMutation.mutate({ poolId: 0 });
  };

  const precentageButtonsConfig = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 75 },
    { value: 100 },
  ];

  if (
    isConnected &&
    (isLPPoolPositionsLoading ||
      !lpPoolPositions ||
      isBalanceLoading ||
      isLiquidityRatioLoading ||
      isLPPoolsLoading ||
      isBusdRateLoading)
  ) {
    return (
      <FlexContainer
        style={{
          height: 380,
          width: 708,
          marginLeft: -136,
        }}
      >
        <FarmingLoader />
      </FlexContainer>
    );
  }

  const { apy: APR, totalLpStaked } = lpPools[0];
  const { pendingReva: revaEarned, lpStaked } = lpPoolPositions[0];

  const { portion0: revaPortion, portion1: bnbPortion } = liquidityRatio;
  const revaStaked = lpStaked.times(revaPortion);
  const bnbStaked = lpStaked.times(bnbPortion);
  const revaDetails = {
    number: revaStaked,
    title: "reva",
    type: coinTypes.TOKEN_CODE_REVA,
  };

  const bnbDetails = {
    number: bnbStaked,
    title: "bnb",
    type: coinTypes.TOKEN_CODE_BNB,
  };

  const isActionButtonDisabled =
    amount <= 0 ||
    (content.type === FarmingModes.Deposit &&
      !(0 <= amount && balance.gte(amount))) ||
    (content.type === FarmingModes.Withdraw &&
      !(0 <= amount && lpStaked.gte(amount)));

  const revaTokenAddress = getToken("reva").address;
  const getTokenLink = PANCAKESWAP_ADD_BNB_URL + revaTokenAddress;
  const totalLiquidity = numberWithCommas(
    busdRate.times(totalLpStaked).toFixed(2),
  );

  return (
    <Panel>
      <PanelContainer>
        <FirstRow>
          <DoubleTokenLogosAndNames>
            <DoubleTokenBox coins={[revaDetails.type, bnbDetails.type]} />
            <DoubleTokenLogosAndNames.RightFrame>
              <PanelTitle>{doubleTokenSymbol}</PanelTitle>
              <Link
                to={{ pathname: getTokenLink }}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  display: "flex",
                }}
              >
                <InlineText
                  size={12}
                  color={colorGrayscaleBody}
                  textTransform="uppercase"
                >
                  Get {doubleTokenSymbol} LP
                </InlineText>
                <StyleGoToIcon />
              </Link>
            </DoubleTokenLogosAndNames.RightFrame>
          </DoubleTokenLogosAndNames>
          <InfoContainer>
            <Info>
              <InfoItem
                title={<NumberFormatter value={APR} suffix="%" withToolTip />}
                subtitle="APR"
                style="text-align: start; padding: 0 1rem;"
              />
              <Divider />
              <InfoItem
                title={
                  <NumberFormatter
                    value={totalLiquidity}
                    prefix="$"
                    withToolTip
                  />
                }
                subtitle="TOTAL LIQUIDITY"
                style="text-align: start; padding: 0 1rem;"
              />
            </Info>
          </InfoContainer>
        </FirstRow>
        <DoubleTokenInPoolInfo>
          <NumAndTitleElement
            number={revaDetails.number}
            title={`${revaDetails.title} in pool`}
            isFirstWordBold
          />
          <Operator>+</Operator>
          <NumAndTitleElement
            number={bnbDetails.number}
            title={`${bnbDetails.title} in pool`}
            isFirstWordBold
          />
          <Operator>=</Operator>
          <NumAndTitleElement number={lpStaked} title="lp deposited" />
          <Divider />

          <NumAndTitleElement
            number={lpStaked.times(busdRate)}
            title="lp value"
            numberPrefix="$"
          />
          <Divider />
          <NumAndTitleElement number={revaEarned} title={"reva earned"} />
        </DoubleTokenInPoolInfo>
        <AssetViewContainer>
          <AssetView
            assetTitle={doubleTokenSymbol.toUpperCase()}
            leftFrameTextTitleTextTransform="uppercase"
            textTransform="uppercase"
            leftFrameTitle={`${content.type} LP Tokens`}
            tokenDetails={{
              symbol: "reva",
              codes: [coinTypes.TOKEN_CODE_REVA, coinTypes.TOKEN_CODE_BNB],
            }}
            balance={content.type === FarmingModes.Deposit ? balance : lpStaked}
            amountText={amount}
            onValueChange={setAmount}
            busdPerToken={busdRate}
            rightFrameTitle={
              content.type === FarmingModes.Withdraw ? (
                ""
              ) : (
                <Link
                  to={{ pathname: getTokenLink }}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <InlineText
                    size={12}
                    color={colorPrimaryDefault}
                    textTransform={"uppercase"}
                    hoverColor="#fff"
                  >
                    Get {doubleTokenSymbol} LP
                  </InlineText>
                </Link>
              )
            }
            balancePrecentageShortcutsConfig={
              content.type === FarmingModes.Withdraw
                ? precentageButtonsConfig
                : undefined
            }
          />
        </AssetViewContainer>
        {isConnected ? (
          <ActionButtons>
            <ActionButton
              text={claimMutation.isLoading ? <LoadingSpinner /> : "Claim"}
              loadingText="Claiming..."
              loading={claimMutation.isLoading}
              outline={colorPrimaryDefault}
              onClick={onClaim}
              background="none"
            />
            {isRevaLpTokenApproved ? (
              <ActionButton
                text={
                  content.type === FarmingModes.Deposit ? (
                    depositMutation.isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      FarmingModes.Deposit
                    )
                  ) : withdrawMutation.isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    FarmingModes.Withdraw + " & Claim"
                  )
                }
                loadingText={
                  depositMutation.isLoading ? "Depositing..." : "Withdrawing..."
                }
                loading={
                  depositMutation.isLoading || withdrawMutation.isLoading
                }
                disabled={isActionButtonDisabled}
                outline={
                  isActionButtonDisabled ? colorGrayscaleBody : undefined
                }
                background={colorPrimaryDefault}
                color={colorGrayscaleOffWhite}
                onClick={() => {
                  content.type === FarmingModes.Deposit
                    ? onDeposit()
                    : onWithdraw();
                  setAmount(0);
                }}
              />
            ) : (
              <ActionButton
                text={
                  isApprovingRevaLpToken ? (
                    <LoadingSpinner />
                  ) : (
                    `Approve ${doubleTokenSymbol}`
                  )
                }
                loading={isApprovingRevaLpToken}
                loadingText="Approving..."
                color={colorGrayscaleOffWhite}
                onClick={approveRevaLpToken}
              />
            )}
          </ActionButtons>
        ) : (
          <ModalConnect
            isConnected={isConnected}
            customButton={
              <ConnectWalletButton
                style={{ minHeight: 60, padding: "10px 0", marginTop: "30px" }}
              >
                Connect Wallet
              </ConnectWalletButton>
            }
          />
        )}
      </PanelContainer>
    </Panel>
  );
}

ContentPanel.propTypes = {
  content: PropTypes.object,
  isConnected: PropTypes.bool,
};

const NumAndTitleElement = ({
  number,
  title,
  isFirstWordBold,
  numberPrefix,
}) => {
  let [firstWordInTitle, ...titleExceptFirstWord] = title.split(" ");
  titleExceptFirstWord = titleExceptFirstWord.join(" ");

  return (
    <div>
      <SimpleText
        fontSize={24}
        color={number.gt(0) ? colorGrayscaleOffWhite : undefined}
      >
        <NumberFormatter value={number} prefix={numberPrefix} withToolTip />
      </SimpleText>
      <BottomTextContainer>
        <SimpleText fontSize={14}>
          {isFirstWordBold ? (
            <>
              <Bold>{firstWordInTitle}</Bold>
              {titleExceptFirstWord}
            </>
          ) : (
            <>{title}</>
          )}
        </SimpleText>
      </BottomTextContainer>
    </div>
  );
};

NumAndTitleElement.propTypes = {
  number: PropTypes.object,
  title: PropTypes.string,
  isFirstWordBold: PropTypes.bool,
  numberPrefix: PropTypes.string,
};

/** Loaders */
const FarmingLoader = () => (
  <ContentLoader
    speed={2}
    width={708}
    height={380}
    viewBox="0 0 708 380"
    backgroundColor="rgba(38, 43, 69, 0.4)"
    foregroundColor="rgba(255, 255, 255, 0.1)"
    style={{
      width: 708,
      height: 380,
      backgroundColor: colorGrayscaleTitleActive,
      borderRadius: 10,
    }}
  >
    <rect x="23" y="28" rx="4" ry="4" width="80" height="47" />
    <rect x="117" y="28" rx="0" ry="0" width="142" height="26" />
    <rect x="117" y="59" rx="0" ry="0" width="118" height="16" />
    <rect x="450" y="28" rx="0" ry="0" width="148" height="39" />
    <rect x="616" y="28" rx="0" ry="0" width="50" height="39" />
    <rect x="478" y="72" rx="0" ry="0" width="120" height="14" />
    <rect x="616" y="72" rx="0" ry="0" width="32" height="14" />
    <rect x="23" y="179" rx="4" ry="4" width="662" height="99" />
    <rect x="23" y="298" rx="4" ry="4" width="317" height="60" />
    <rect x="368" y="298" rx="4" ry="4" width="317" height="60" />
    <rect x="26" y="105" rx="0" ry="0" width="94" height="24" />
    <rect x="26" y="135" rx="0" ry="0" width="94" height="18" />
    <circle cx="154" cy="132" r="14" />
    <rect x="190" y="105" rx="0" ry="0" width="94" height="24" />
    <rect x="190" y="135" rx="0" ry="0" width="94" height="18" />
    <circle cx="314" cy="132" r="14" />
    <rect x="340" y="105" rx="0" ry="0" width="94" height="24" />
    <rect x="340" y="135" rx="0" ry="0" width="94" height="18" />
    <rect x="463" y="105" rx="0" ry="0" width="94" height="24" />
    <rect x="463" y="135" rx="0" ry="0" width="94" height="18" />
    <rect x="586" y="105" rx="0" ry="0" width="94" height="24" />
    <rect x="586" y="135" rx="0" ry="0" width="94" height="18" />
  </ContentLoader>
);

/** Styled Components */
const PageTitle = styled(Title)`
  display: flex;
  justify-content: center;
  margin-top: 47px;
  margin-bottom: 0;
  font-size: 32px;
`;

const PageSubtitle = styled(Subtitle)`
  display: flex;
  justify-content: center;
  font-size: 14px;
  margin-top: 5px;
`;

const StakingTabs = styled.div`
  margin-top: 20px;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PanelTitle = styled(PageTitle)`
  font-size: 20px;
  text-transform: uppercase;
  font-weight: bolder;
  margin: 0 0;
  height: 50%;
  justify-content: flex-start;
`;

const PanelContainer = styled.div`
  color: white;
  background-color: ${colorGrayscaleTitleActive};
  width: 150%;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 20rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: start;
`;

const Info = styled(InfoContainer)`
  position: relative;
  flex-direction: row;
`;

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;
const DoubleTokenInPoolInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
`;

const SimpleText = styled.div`
  font-size: ${(props) => props.fontSize}px;
  color: ${colorGrayscaleBody};
  margin: 0 0.1rem 0;
  text-transform: uppercase;
  font-style: normal;
  font-weight: "500";
  line-height: 32px;
  background-color: transparent;
  text-align: start;
  border: none;
  outline: none;
`;

const BottomTextContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Operator = styled.div`
  border-radius: 50%;
  background: ${colorGrayscaleDark};
  color: ${colorGrayscaleBody};
  font-weight: bold;
  padding: 5px;
  text-align: center;
  display: flex;
  width: 1rem;
  height: 1rem;
  align-items: center;
  justify-content: center;
`;

const AssetViewContainer = styled.div`
  border: 0.5px solid ${colorGrayscaleBody};
  border-radius: 10px;
  width: 100%;
`;

const DoubleTokenLogosAndNames = styled.div`
  text-transform: uppercase;
  display: flex;
  align-items: center;
`;

DoubleTokenLogosAndNames.RightFrame = styled(Panel)`
  margin: 0 0 0 1rem;
`;

const Bold = styled.span`
  font-weight: bold;
  color: ${colorPrimaryDefault};
  padding-right: 0.3rem;
`;

const StyleGoToIcon = styled(GoToIcon)`
  fill: ${colorGrayscaleBody};
  margin: 0 2px;
`;
