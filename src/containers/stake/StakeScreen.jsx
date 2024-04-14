import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useMetamask } from "use-metamask";
import PropTypes from "prop-types";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import InfoItem from "@components/InfoItem";
import { getToken } from "@src/apis/utils/addresses";
import { fetchTokenToBusdRate } from "@src/sagas/rates";
import ContentLoader from "react-content-loader";
import { formatNumericString } from "../../helpers/utils";
import { useRevaStats } from "@src/hooks/revaStats.hooks";

import Header from "@components/Header";
import Tabs from "@components/Tabs";
import { Title } from "@components/TokenPair/index.styles";
import { Subtitle } from "@components/TokenSelect/TokenCard.styles";
import StakePools from "./partials/StakePools";
import {
  ActionButton,
  ActionButtons,
  Root,
  InlineText,
  Paragraph,
} from "../common/styles";
import StakeOrUnstakeButton from "./partials/StakeConfirmModal";
import { colorPrimaryDefault, colorErrorDefault } from "@src/colors";
import { useDispatch, useSelector } from "react-redux";
import { loadStakeData } from "../../actions/stakeActions";
import { StakeReducerStates } from "../../reducers/stakeReducer";
import StakeInfo from "./partials/StakeInfo";
import AssetView from "@components/AssetView";
import LoadingSpinner from "@components/LoadingSpinner";
import ModalConnect from "@components/ModalConnect";
import { FlexContainer } from "../../components/BasicStyled";
import Timer from "easytimer.js";
import { useForceUpdate } from "../../helpers/hooks";
import {
  claimReva,
  fetchRevaBalance,
  stakeReva,
  unstakeReva,
} from "../../sagas/stake";
import { QUERY_KEYS, TOKEN_CODE_REVA } from "../../constants";
import { ActionButton as ConnectWalletButton } from "@components/PositionSidePane/ControlPanel.styles";
import _ from "lodash";
import { onTransaction } from "../../utils";
import {
  useApproveToken,
  useIsTokenApproved,
} from "../../hooks/approveToken.hooks";
import { config } from "../../config/config";
import { colorGrayscaleOffWhite } from "../../colors";
import { getTokenLink } from "../../helpers/utils";
import Big from "big.js";
import NumberFormatter from "../../components/NumberFormatter";

const addresses = config.getNetworkAddresses();
export const StakeModes = Object.freeze({
  Stake: "Stake",
  Unstake: "Unstake",
});

export default function StakeScreen() {
  const { metaState } = useMetamask();
  const [selectedTab, setSelectedTab] = useState(0);
  const dispatch = useDispatch();
  const stakeState = useSelector((state) => state.stakeState);
  const [selectedPool, setSelectedPool] = useState(0);
  const [timers, setTimers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [areSomePoolsStaked, setAreSomePoolsStaked] = useState(false);
  const [totalRevaStaked, setTotalRevaStaked] = useState();

  const { status, data } = stakeState;

  useEffect(() => {
    dispatch(loadStakeData());
  }, [dispatch, metaState.isConnected]);

  useEffect(() => {
    if (data && data.userPositions) {
      const { userPositions, pools } = data;
      const timersData = {};

      userPositions.forEach((poolPosition) => {
        const { timeStaked, poolId } = poolPosition;
        const timeLeft =
          pools[poolId].lockPeriod - timeStaked <= 0
            ? 0
            : pools[poolId].lockPeriod - timeStaked;

        timersData[poolId] = new Timer({
          startValues: {
            days: poolId === 0 ? 0 : Math.floor(timeLeft / (3600 * 24)),
            hours:
              poolId === 0 ? 0 : Math.floor((timeLeft % (3600 * 24)) / 3600),
            minutes: poolId === 0 ? 0 : Math.floor((timeLeft % 3600) / 60),
            seconds: poolId === 0 ? 0 : Math.floor(timeLeft % 60),
          },
          countdown: true,
        });

        timersData[poolId].start();
      });

      setTimers(timersData);

      setAreSomePoolsStaked(
        userPositions.some((pool) => pool.revaStaked.gt(0)),
      );
    }
  }, [data]);

  useEffect(() => {
    if (data && data.pools) {
      const { pools } = data;
      const allPoolsRevaStaked = pools.reduce((stakedReva, pool) => {
        stakedReva += pool.totalRevaStaked;
        return stakedReva;
      }, 0);

      setTotalRevaStaked(allPoolsRevaStaked);
    }
  }, [data, selectedPool]);

  useEffect(() => {
    setIsLoading(status === StakeReducerStates.Loading && _.isEmpty(data));
  }, [status]);

  const onTabSelect = (newSelectedTab) => {
    const { userPositions } = data;
    const selectedPoolUserPosition = userPositions[selectedPool];
    setSelectedTab(newSelectedTab);
    if (selectedTab === 0 && newSelectedTab === 1) {
      // switched from STAKE tab to UNSTAKE tab -> to prevent falling into staked pool if stake tab is pressed twice
      if (selectedPoolUserPosition.revaStaked <= 0) {
        const firstStakedPoolIndex = userPositions.findIndex(
          (pool) => pool.revaStaked > 0,
        );
        if (firstStakedPoolIndex !== -1) {
          setSelectedPool(firstStakedPoolIndex);
        }
      }
    }
  };

  const sharedProps = {
    isConnected: metaState.isConnected,
    data,
    selectedPool,
    setSelectedPool: setSelectedPool,
    timers,
    isLoading,
  };

  const TitleSectionLayoutProps = {
    container: {
      justifyItems: "start",
      alignItems: "start",
      margin: "130px auto",
    },
    pageTitle: {
      textAlign: "start",
      fontSize: "48px",
    },
    totalStakeContainer: {
      display: "flex",
    },
  };

  return (
    <Root>
      <Header isConnected={metaState.isConnected} />
      <Body isConnected={metaState.isConnected}>
        <TitleSection
          title="Lock REVA to Boost Rewards"
          subtitle="Locking REVA will increase yield and voting power"
          layout={TitleSectionLayoutProps}
          totalRevaStaked={totalRevaStaked ? totalRevaStaked.toFixed() : null}
        />
        <StakingTabs isConnected={metaState.isConnected}>
          <Tabs
            selectedIndex={selectedTab}
            onSelect={onTabSelect}
            tabs={[
              {
                title: StakeModes.Stake,
                disabled: !metaState.isConnected || isLoading,
              },
              {
                title: StakeModes.Unstake,
                disabled:
                  isLoading || !metaState.isConnected || !areSomePoolsStaked,
              },
            ]}
            panels={[
              <ContentPanel
                key={StakeModes.Stake}
                content={getContentByPanel({ type: StakeModes.Stake })}
                {...sharedProps}
              />,
              <ContentPanel
                key={StakeModes.Unstake}
                content={getContentByPanel({ type: StakeModes.Unstake })}
                {...sharedProps}
              />,
            ]}
          />
        </StakingTabs>
      </Body>
    </Root>
  );
}

function ContentPanel({
  content,
  isConnected,
  data,
  selectedPool,
  setSelectedPool,
  timers,
  isLoading,
}) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState();
  const forceUpdate = useForceUpdate();

  const { data: balance, refetch: fetchBalance } = useQuery(
    QUERY_KEYS.revaStakeBalance,
    async () => {
      if (!isConnected) {
        return;
      }
      const balance = await fetchRevaBalance({
        userAddress: window.ethereum.selectedAddress,
      });
      return balance;
    },
    {
      refetchInterval: 3000,
    },
  );

  const claimMutation = useMutation(
    () => {
      return claimReva({ poolId: selectedPoolData.poolId });
    },
    {
      onSuccess: (txHash) =>
        onTransaction({ txHash, callback: () => dispatch(loadStakeData()) }),
    },
  );

  const { revaToken, revaStakingPool } = addresses;
  const { data: isRevaTokenApproved } = useIsTokenApproved({
    tokenAddress: revaToken,
    targetAddress: revaStakingPool,
  });
  const { mutate: approveRevaToken, isLoading: isApprovingRevaToken } =
    useApproveToken({
      params: {
        tokenAddress: revaToken,
        targetAddress: revaStakingPool,
      },
    });

  const stakeMutation = useMutation(
    () => {
      const txHash = stakeReva({ poolId: selectedPoolData.poolId, amount });
      return txHash;
    },
    {
      onSuccess: (txHash) =>
        onTransaction({ txHash, callback: () => dispatch(loadStakeData()) }),
    },
  );

  const unstakeMutation = useMutation(
    () => {
      const isEarly =
        timers[selectedPoolUserPosition?.poolId]?.isRunning() &&
        selectedPoolUserPosition.revaStaked.gt(0);
      return unstakeReva({ poolId: selectedPoolData.poolId, amount, isEarly });
    },
    {
      onSuccess: (txHash) =>
        onTransaction({ txHash, callback: () => dispatch(loadStakeData()) }),
    },
  );

  const { data: busdRate } = useQuery(
    QUERY_KEYS.revaToBusdRate,
    async () => {
      const { tokenId } = getToken("reva");
      const busdRate = await fetchTokenToBusdRate({ tokenId });
      return busdRate;
    },
    {
      refetchInterval: 10 * 1000, // 10 seconds,
    },
  );

  useEffect(() => {
    if (isConnected) {
      fetchBalance();
    }
  }, [isConnected]);

  useEffect(() => {
    if (data && data.pools) {
      const selectedPoolData = data.pools[selectedPool];
      const activeTimer = timers[selectedPoolData.poolId];

      activeTimer?.addEventListener("secondsUpdated", () => {
        forceUpdate();
      });
      return () => activeTimer?.removeEventListener("secondsUpdated");
    }
  }, [data, selectedPool, timers]);

  const onClaim = async () => {
    return claimMutation.mutate({ poolId: selectedPoolData.poolId });
  };

  const getStakeOrUnstakeMutation = () => {
    switch (content.type) {
      case StakeModes.Stake:
        return stakeMutation;
      case StakeModes.Unstake:
        return unstakeMutation;
    }
  };
  if (isLoading) {
    return (
      <FlexContainer style={{ minHeight: 200 }}>
        <StakeLoader />
      </FlexContainer>
    );
  }

  const { pools, userPositions } = data;

  const selectedPoolData = pools[selectedPool];
  const selectedPoolUserPosition = userPositions
    ? userPositions[selectedPool]
    : undefined;
  const isPoolLocked = selectedPoolUserPosition
    ? timers[selectedPoolUserPosition?.poolId]?.isRunning() &&
      selectedPoolUserPosition.revaStaked.gt(0)
    : false;

  const precentageButtonsConfig = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 75 },
    { value: 100 },
  ];

  return (
    <Panel>
      <PanelTitle>{content.panelTitle}</PanelTitle>
      <StakePools
        userPositions={userPositions}
        pools={pools}
        selectedPool={selectedPool}
        onSelect={setSelectedPool}
        disableNonStakedPools={content.type === StakeModes.Unstake}
      />

      <AssetView
        leftFrameTitle={
          content.type === StakeModes.Stake ? "Stake Reva" : "Unstake Reva"
        }
        assetTitle="REVA"
        tokenDetails={{ symbol: "reva", codes: [TOKEN_CODE_REVA] }}
        busdPerToken={busdRate}
        balance={
          !isConnected
            ? new Big(0)
            : content.type === StakeModes.Stake
            ? balance
            : selectedPoolUserPosition.revaStaked
        }
        amountText={amount}
        onValueChange={setAmount}
        rightFrameTitle={
          content.type === StakeModes.Stake ? (
            <Link
              to={{ pathname: getTokenLink("reva") }}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <InlineText
                size={12}
                color={colorPrimaryDefault}
                hoverColor="#fff"
              >
                Get Reva
              </InlineText>
            </Link>
          ) : null
        }
        balancePrecentageShortcutsConfig={
          content.type === StakeModes.Unstake
            ? precentageButtonsConfig
            : undefined
        }
        isDisabled={!isConnected}
      />
      {isConnected ? (
        <>
          <ActionButtons>
            <ActionButton
              text={claimMutation.isLoading ? <LoadingSpinner /> : "Claim"}
              loading={claimMutation.isLoading}
              loadingText="Claiming..."
              outline={colorPrimaryDefault}
              onClick={onClaim}
              background="none"
            />
            {isRevaTokenApproved ? (
              <StakeOrUnstakeButton
                type={content.type}
                onConfirm={async () => {
                  await getStakeOrUnstakeMutation().mutate({});
                  setAmount(0);
                }}
                loading={getStakeOrUnstakeMutation().isLoading}
                locked={
                  selectedPoolUserPosition
                    ? timers[selectedPoolUserPosition?.poolId]?.isRunning() &&
                      selectedPoolUserPosition.revaStaked.gt(0)
                    : false
                }
                disabled={
                  content.type === StakeModes.Stake
                    ? balance?.eq(0) ||
                      !amount ||
                      amount === 0 ||
                      (amount > 0 && balance?.lt(amount))
                    : selectedPoolUserPosition.revaStaked.eq(0) ||
                      (amount > 0 &&
                        selectedPoolUserPosition.revaStaked.lt(amount))
                }
                lockPeriod={selectedPoolData.lockPeriod}
              />
            ) : (
              <ActionButton
                text={
                  isApprovingRevaToken ? <LoadingSpinner /> : "Approve REVA"
                }
                loading={isApprovingRevaToken}
                loadingText="Approving..."
                color={colorGrayscaleOffWhite}
                onClick={async () => {
                  await approveRevaToken();
                }}
              />
            )}
          </ActionButtons>
        </>
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
      {isPoolLocked && content.actionWarning}
      <StakeInfo
        pendingReva={selectedPoolUserPosition?.pendingReva}
        revaStaked={selectedPoolUserPosition?.revaStaked}
        multiplier={selectedPoolData.multiplier}
        lockPeriod={selectedPoolData.lockPeriod}
        timeLeft={
          isConnected
            ? timers[selectedPoolUserPosition?.poolId]?.isRunning() &&
              selectedPoolUserPosition.revaStaked.gt(0)
              ? timers[selectedPoolUserPosition?.poolId]?.getTimeValues()
              : undefined
            : selectedPool === 0
            ? undefined
            : new Timer({
                startValues: {
                  days: Math.floor(
                    pools[selectedPool].lockPeriod / (3600 * 24),
                  ),
                  hours: Math.floor(
                    (pools[selectedPool].lockPeriod % (3600 * 24)) / 3600,
                  ),
                  minutes: Math.floor(
                    (pools[selectedPool].lockPeriod % 3600) / 60,
                  ),
                  seconds: Math.floor(pools[selectedPool].lockPeriod % 60),
                },
                countdown: false,
              }).getTimeValues()
        }
      />
    </Panel>
  );
}

ContentPanel.propTypes = {
  content: PropTypes.object,
  isConnected: PropTypes.bool,
  data: PropTypes.shape({
    pools: PropTypes.array,
    userPositions: PropTypes.array,
  }),
  selectedPool: PropTypes.number,
  setSelectedPool: PropTypes.func,
  timers: PropTypes.shape({ poolId: PropTypes.instanceOf(Timer) }),
  isLoading: PropTypes.bool,
};

const getContentByPanel = ({ type }) => {
  const content = { type };
  switch (type) {
    case StakeModes.Stake:
      content.panelTitle = "Select your boost power";
      break;
    case StakeModes.Unstake:
      content.panelTitle = "Selected boost power";
      content.actionWarning = (
        <Paragraph size={14}>
          Unstake REVA before the lock timer has ended will trigger{" "}
          <InlineText color={colorErrorDefault}>25% </InlineText>withdrawal fee
        </Paragraph>
      );
      break;
  }

  return content;
};

function TitleSection({ totalRevaStaked, layout, title, subtitle }) {
  const revaStats = useRevaStats();
  const { loading: loadingRevaStats } = revaStats;
  const circSupply = revaStats.value?.circSupply;
  const isLoading = loadingRevaStats || !totalRevaStaked;

  return (
    <TitleSectionContainer {...layout.container}>
      <PageTitle {...layout.pageTitle}>{title}</PageTitle>
      <PageSubtitle>{subtitle}</PageSubtitle>

      <div
        style={{
          display: layout.totalStakeContainer.display,
          marginTop: "5rem",
          position: "relative",
        }}
      >
        <InfoItem
          title={`${formatNumericString(totalRevaStaked)}`}
          style="text-align: start;"
          subtitle="Total Reva Staked"
          titleStyle="font-size: 46px; margin-bottom: 20px"
          subtitleStyle="font-weight: 400;"
          loading={isLoading}
        />
        {!isLoading ? (
          <div
            style={{
              border: "1px solid #424B6D",
              transform: "rotate(25.81deg)",
              marginLeft: 20,
              marginBottom: 10,
              marginTop: -10,
              height: "90%",
            }}
          />
        ) : null}
        <InfoItem
          title={formatNumericString(circSupply)}
          style="text-align: start; margin-left: 28px"
          subtitle="reva in circulation"
          titleStyle="font-size: 46px; margin-bottom: 20px"
          subtitleStyle="font-weight: 400;"
          loading={isLoading}
        />
      </div>
    </TitleSectionContainer>
  );
}

TitleSection.propTypes = {
  isConnected: PropTypes.bool,
  totalRevaStaked: PropTypes.string,
  layout: PropTypes.shape({
    container: PropTypes.shape({
      justifyItems: PropTypes.string,
      alignItems: PropTypes.string,
      margin: PropTypes.string,
    }),
    pageTitle: PropTypes.shape({
      textAlign: PropTypes.string,
      fontSize: PropTypes.string,
    }),
    totalStakeContainer: PropTypes.shape({
      display: PropTypes.string,
    }),
  }),
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

/** Loaders */
const StakeLoader = (props) => (
  <ContentLoader
    speed={2}
    width={440}
    height={482}
    viewBox="0 0 440 482"
    backgroundColor="rgba(38, 43, 69, 0.4)"
    foregroundColor="rgba(255, 255, 255, 0.1)"
    {...props}
  >
    <rect x="81" y="9" rx="0" ry="0" width="271" height="21" />
    <rect x="0" y="75" rx="0" ry="0" width="100" height="48" />
    <rect x="110" y="75" rx="0" ry="0" width="100" height="48" />
    <rect x="220" y="75" rx="0" ry="0" width="100" height="48" />
    <rect x="330" y="75" rx="0" ry="0" width="108" height="48" />
    <rect x="128" y="137" rx="4" ry="4" width="55" height="55" />
    <rect x="257" y="137" rx="4" ry="4" width="55" height="55" />
    <rect x="383" y="137" rx="4" ry="4" width="55" height="55" />
    <rect x="0" y="137" rx="4" ry="4" width="55" height="55" />
    <rect x="0" y="210" rx="4" ry="4" width="440" height="97" />
    <rect x="0" y="336" rx="6" ry="6" width="440" height="44" />
    <rect x="8" y="435" rx="0" ry="0" width="66" height="33" />
    <rect x="365" y="435" rx="0" ry="0" width="66" height="33" />
    <rect x="184" y="435" rx="0" ry="0" width="66" height="33" />
    <rect x="0" y="473" rx="0" ry="0" width="82" height="15" />
    <rect x="177" y="473" rx="0" ry="0" width="82" height="15" />
    <rect x="358" y="473" rx="0" ry="0" width="82" height="15" />
  </ContentLoader>
);

/** Styled Components */
const PageTitle = styled(Title)`
  margin-top: 47px;
  text-align: ${(props) => props.textAlign};
  margin-bottom: 0;
  font-size: ${(props) => props.fontSize};
  height: auto;
  width: auto;
`;

const PageSubtitle = styled(Subtitle)`
  font-size: 14px;
  margin-top: 5px;
  width: auto;
`;

const StakingTabs = styled.div`
  margin-top: 50px;
  margin-bottom: 70px;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PanelTitle = styled(Title)`
  display: flex;
  justify-content: center;
  font-size: 16px;
  text-transform: uppercase;
`;

const TitleSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: ${(props) => props.justifyItems};
  align-items: ${(props) => props.alignItems};
  width: 530px;
  margin: ${(props) => props.margin};
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;
