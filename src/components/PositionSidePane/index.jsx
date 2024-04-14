import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import usePortal from "react-cool-portal";
import { useDispatch, useSelector } from "react-redux";
import {
  loadVaults,
  refreshVault,
  periodicUpdate,
  approvalSuccess,
} from "../../actions/vaults";
import {
  useDeposit,
  useZapAndDeposit,
  useWithdraw,
  useClaim,
  useRebalance,
} from "../../hooks/vaults.hooks";
import { useApproveToken } from "../../hooks/approveToken.hooks";

import DoubleTokenBox from "../DoubleTokenBox";
import SingleTokenBox from "../SingleTokenBox";
import TopVaults from "../TopVaults";
import VaultStats from "./VaultStats";
import ClosingStripe from "./ClosingStripe";
import ControlPanel from "./ControlPanel";
import MetaMaskConnect from "../ModalConnect/MetaMaskConnect";
import RebalanceDialog from "./RebalanceDialog";

import { Root, SidePane, Title, Scrollable } from "./index.styles";
import { Divider } from "../Common.styles";

import { colorGrayscaleOffWhite } from "../../colors";
import NumberFormatter from "../NumberFormatter";

export const ControlMode = {
  DETAILS: "DETAILS",
  WITHDRAW: "WITHDRAW",
  DEPOSIT: "DEPOSIT",
  EXCHANGE: "EXCHANGE",
};

export default function PositionSidePane({
  data,
  isConnected,
  isOpen,
  onCloseClicked,
}) {
  const { Portal, show, hide } = usePortal({
    defaultShow: false,
    clickOutsideToHide: false,
  });

  const tokenId = data?.tokenId;
  const position = data?.position || {};
  const inPosition = data?.inPosition || false;

  const dispatch = useDispatch();
  const vaultsState = useSelector((state) => state.vaultsState);
  const account =
    vaultsState.data?.accounts?.length > 0 ? vaultsState.data.accounts[0] : "";

  const [isExpanded, setIsExpanded] = useState(false);
  const [rebalanceData, setRebalanceData] = useState();
  const [mode, setMode] = useState(getInitialMode(inPosition));

  const { mutate: depositMutation, isLoading: isDepositing } = useDeposit({
    onSuccess: () => {
      setMode(ControlMode.DETAILS);
      refreshVaultState();
    },
  });

  const { mutate: zapAndDepositMutation, isLoading: isZapping } =
    useZapAndDeposit({
      onSuccess: () => {
        setMode(ControlMode.DETAILS);
        refreshVaultState();
      },
    });

  const { mutate: withdrawMutation, isLoading: isWithdrawing } = useWithdraw({
    onSuccess: ({ isMax }) => {
      setMode(isMax ? ControlMode.DEPOSIT : ControlMode.DETAILS);
      refreshVaultState();
    },
  });

  const { mutate: rebalanceMutation, isLoading: isRebalancing } = useRebalance({
    onSuccess: () => {
      dispatch(loadVaults(isConnected));
    },
  });

  const { mutate: claimMutation, isLoading: isClaiming } = useClaim({
    onSuccess: refreshVaultState,
  });

  const { mutate: approveTokenMutation, isLoading: isApprovingToken } =
    useApproveToken({
      onSuccess: ({ tokenAddress, targetAddress }) => {
        dispatch(approvalSuccess({ tokenAddress, targetAddress }));
      },
    });

  useEffect(() => {
    setMode(getInitialMode(inPosition));
  }, [tokenId]);

  useEffect(() => {
    if (isConnected === false) {
      setIsExpanded(false);
      setMode(ControlMode.DEPOSIT);
    }
  }, [isConnected]);

  if (!isOpen || _.isEmpty(data)) {
    return null;
  }

  const coins = data.tokenDetails.codes;
  const inBestPosition =
    inPosition && position.vaultId === data?.vaults[0].vaultId;
  const loadingStates = {
    isRefreshing: vaultsState.isRequesting,
    isDepositing,
    isZapping,
    isWithdrawing,
    isRebalancing,
    isClaiming,
    isApprovingToken,
  };
  const displayVault = _.isEmpty(position) ? data.vaults[0] : position;

  const handleOnClose = (e) => {
    e.stopPropagation();
    setIsExpanded(false);
    onCloseClicked();
  };

  const handleDepositClick = (payload) => {
    if (isConnected) {
      if (payload.isExchange) {
        zapAndDepositMutation({
          fromTokenId: payload.fromTokenId,
          toVaultId: payload.toVaultId,
          amount: payload.amount,
        });
      } else {
        depositMutation({
          vaultId: payload.vaultId,
          amount: payload.amount,
        });
      }
    } else {
      show();
    }
  };

  const handleWithdrawClick = (payload) => {
    if (payload.amount > 0) {
      withdrawMutation(payload);
    }
  };

  const handleRebalanceClick = (payload) => {
    hide();
    rebalanceMutation(payload);
  };

  const handleClaimClick = (payload) => claimMutation(payload);

  const handleApproveClick = (payload) => approveTokenMutation(payload);

  const handleExpandedChanged = (expanded) => {
    setIsExpanded(expanded);
    setMode(getInitialMode(inPosition));
  };

  const handleOnSidePaneClick = (e) => {
    e.stopPropagation();
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  function refreshVaultState() {
    dispatch(refreshVault(tokenId));
    dispatch(periodicUpdate());
  }

  return (
    <>
      <Root onClick={handleOnClose}>
        <SidePane onClick={handleOnSidePaneClick}>
          <Title>
            <Title.Prefix>
              {data.tokenDetails.symbol}
              <Title.Prefix.TVL>
                <NumberFormatter value={data.tvl} prefix="$" suffix=" TVL" />
              </Title.Prefix.TVL>
            </Title.Prefix>
            {coins.length > 1 ? (
              <DoubleTokenBox
                coins={coins}
                background={colorGrayscaleOffWhite}
              />
            ) : (
              <SingleTokenBox
                coin={coins[0]}
                background={colorGrayscaleOffWhite}
              />
            )}
          </Title>
          <Scrollable>
            {!isExpanded && (
              <>
                <TopVaults
                  data={data}
                  position={position}
                  inBestPosition={inBestPosition}
                  isConnected={isConnected}
                  isLoading={isRebalancing}
                  onRebalanceClick={(payload) => {
                    setRebalanceData(payload);
                    show();
                  }}
                />
                <Divider style={{ marginTop: 34, marginBottom: 34 }} />
              </>
            )}
            <VaultStats
              data={displayVault}
              inPosition={inPosition}
              isConnected={isConnected}
              inBestPosition={inBestPosition}
              revaApy={parseFloat(data.revaApy)}
            />
            <ClosingStripe />
          </Scrollable>
          <ControlPanel
            data={data}
            position={position}
            mode={mode}
            inPosition={inPosition}
            isConnected={isConnected}
            isExpanded={isExpanded}
            inBestPosition={inBestPosition}
            loadingStates={loadingStates}
            onConnectClick={show}
            onDepositClick={handleDepositClick}
            onWithdrawClick={handleWithdrawClick}
            onClaimClick={handleClaimClick}
            onApproveClick={handleApproveClick}
            onExpandedChanged={handleExpandedChanged}
            onModeChange={(mode) => setMode(mode)}
          />
        </SidePane>
      </Root>
      <Portal>
        {isConnected ? (
          <RebalanceDialog
            account={account}
            data={rebalanceData}
            isRequesting={
              loadingStates.isRefreshing || loadingStates.isRebalancing
            }
            onClick={handleRebalanceClick}
            onClose={hide}
          />
        ) : (
          <MetaMaskConnect onClose={hide} />
        )}
      </Portal>
    </>
  );
}

function getInitialMode(inPosition) {
  return inPosition ? ControlMode.DETAILS : ControlMode.DEPOSIT;
}

PositionSidePane.propTypes = {
  data: PropTypes.object,
  position: PropTypes.object,
  isConnected: PropTypes.bool,
  isOpen: PropTypes.bool,
  onCloseClicked: PropTypes.func,
};
