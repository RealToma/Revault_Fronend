import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { RevaApi } from "../../apis";
import { useMutation } from "react-query";
import { useOnClickOutside } from "../../helpers/hooks";
import ContentLoader from "react-content-loader";

import NumberFormatter from "../NumberFormatter";

import {
  Root,
  Title,
  Subtitle,
  Header,
  Row,
  ActionButton,
} from "./RebalanceDialog.styles";

import iconX from "../../assets/icon-x.png";

export default function RebalanceDialog({ account, data, onClick, onClose }) {
  const ref = useRef();
  useOnClickOutside(ref, onClose);

  const statsMutation = useMutation(() =>
    rebalanceStats({
      fromVaultId: data.fromVaultId,
      toVaultId: data.toVaultId,
      userAddress: account,
    }),
  );

  useEffect(() => {
    if (data) {
      statsMutation.mutate();
    }
  }, [data]);

  const statsAreLoading =
    statsMutation.isLoading || statsMutation.status === "idle";

  return (
    <Root ref={ref}>
      <Title>
        Rebalance
        <Title.Close src={iconX} onClick={() => onClose()} />
      </Title>
      <Subtitle>
        The Rebalance action will relay your funds from your current active
        vault to the best performing one.
      </Subtitle>
      {
        <>
          <Header style={{ marginTop: 15 }}>Rebalance Costs:</Header>
          <Row>
            <Row.MainItem>Total Rebalance Cost:</Row.MainItem>
            <Row.MainItem>
              {statsAreLoading ? (
                <StatLoader />
              ) : (
                <NumberFormatter
                  value={statsMutation.data.actionCost}
                  prefix="$"
                  precision={2}
                />
              )}
            </Row.MainItem>
          </Row>
          <Row>
            <Row.Item>Withdraw Fees:</Row.Item>
            <Row.Item>
              {statsAreLoading ? (
                <StatLoader />
              ) : (
                <NumberFormatter
                  value={statsMutation.data.withdrawFee}
                  prefix="$"
                  precision={2}
                />
              )}
            </Row.Item>
          </Row>
          <Row>
            <Row.Item>Deposit Fees:</Row.Item>
            <Row.Item>
              {statsAreLoading ? (
                <StatLoader />
              ) : (
                <NumberFormatter
                  value={statsMutation.data.depositFee}
                  prefix="$"
                  precision={2}
                />
              )}
            </Row.Item>
          </Row>
          <Row>
            <Row.Item>Gas fees:</Row.Item>
            <Row.Item>
              {statsAreLoading ? (
                <StatLoader />
              ) : (
                <NumberFormatter
                  value={statsMutation.data.gasFee}
                  prefix="$"
                  precision={2}
                />
              )}
            </Row.Item>
          </Row>
          <Header style={{ marginTop: 25 }}>
            Rebalance gains estimations:
          </Header>
          <Row>
            <Row.Item>24 Hours:</Row.Item>
            <Row.Item>
              {statsAreLoading ? (
                <StatLoader />
              ) : (
                <NumberFormatter
                  value={statsMutation.data.gain24h}
                  prefix="$"
                  precision={2}
                />
              )}
            </Row.Item>
          </Row>
          <Row>
            <Row.Item>7 Days:</Row.Item>
            <Row.Item>
              {statsAreLoading ? (
                <StatLoader />
              ) : (
                <NumberFormatter
                  value={statsMutation.data.gain7d}
                  prefix="$"
                  precision={2}
                />
              )}
            </Row.Item>
          </Row>
          <Row>
            <Row.Item>30 Days:</Row.Item>
            <Row.Item>
              {statsAreLoading ? (
                <StatLoader />
              ) : (
                <NumberFormatter
                  value={statsMutation.data.gain30d}
                  prefix="$"
                  precision={2}
                />
              )}
            </Row.Item>
          </Row>

          <Subtitle style={{ marginTop: 14 }}>
            {statsAreLoading ? (
              <SubtitleLoader />
            ) : (
              <>
                *You will gain the rebalance costs back in{" "}
                {`${statsMutation.data.timeToBreakEven.days}`}d and{" "}
                {`${statsMutation.data.timeToBreakEven.hours}`}h
              </>
            )}
          </Subtitle>
          <ActionButton
            text="Confirm Rebalance"
            disabled={statsAreLoading}
            onClick={() =>
              onClick({ ...data, txGas: statsMutation.data.txGas })
            }
          />
        </>
      }
    </Root>
  );
}

async function rebalanceStats({ fromVaultId, toVaultId, userAddress }) {
  try {
    const revaApi = RevaApi();
    const data = await revaApi.rebalanceStats(
      fromVaultId,
      toVaultId,
      userAddress,
    );

    return data;
  } catch (error) {
    console.log(error);
    // TODO parse error to fit FE structure
    const parsedError = error;
    throw parsedError;
  }
}

RebalanceDialog.propTypes = {
  data: PropTypes.object,
  account: PropTypes.string,
  isRequesting: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};

const StatLoader = (props) => (
  <ContentLoader
    speed={2}
    width={40}
    height={12}
    viewBox="0 0 40 12"
    backgroundColor="rgba(38, 43, 69, 0.4)"
    foregroundColor="rgba(255, 255, 255, 0.1)"
    {...props}
  >
    <rect x="0" y="0" rx="4" ry="4" width="40" height="12" />
  </ContentLoader>
);

const SubtitleLoader = (props) => (
  <ContentLoader
    speed={2}
    width={340}
    height={12}
    viewBox="0 0 340 12"
    backgroundColor="rgba(38, 43, 69, 0.4)"
    foregroundColor="rgba(255, 255, 255, 0.1)"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="340" height="12" />
  </ContentLoader>
);
