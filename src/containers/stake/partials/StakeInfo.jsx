import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import InfoItem from "@components/InfoItem";
import Big from "big.js";
import NumberFormatter from "../../../components/NumberFormatter";

export default function StakeInfo({
  multiplier,
  pendingReva,
  revaStaked,
  lockPeriod,
  timeLeft,
}) {
  const getProgressValue = () => {
    const { days, hours, minutes, seconds } = timeLeft;

    const timeLeftInSeconds =
      days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;

    return ((lockPeriod - timeLeftInSeconds) / lockPeriod).toFixed(2);
  };

  return (
    <Root>
      <Items>
        <InfoItem
          title={multiplier && `x${multiplier}`}
          subtitle="Selected Pool"
        />
        <InfoItem
          title={<NumberFormatter value={pendingReva} withToolTip />}
          subtitle="REVA Earned"
        />
        <InfoItem
          title={<NumberFormatter value={revaStaked} withToolTip />}
          subtitle="REVA Staked"
        />
        {timeLeft && (
          <InfoItem
            title={`${timeLeft.toString([
              "days",
              "hours",
              "minutes",
              "seconds",
            ])}`}
            subtitle="Time Left"
          />
        )}
      </Items>
      {timeLeft && (
        <ProgressBarContainer>
          <progress
            value={revaStaked && timeLeft ? getProgressValue() : 0}
            max="1"
          />
        </ProgressBarContainer>
      )}
    </Root>
  );
}

StakeInfo.propTypes = {
  multiplier: PropTypes.number,
  pendingReva: PropTypes.instanceOf(Big),
  revaStaked: PropTypes.instanceOf(Big),
  timeLeft: PropTypes.object, // days, hours, minutes, seconds, tenth of seconds
  lockPeriod: PropTypes.number,
};

StakeInfo.defaultProps = {
  pendingReva: new Big(0),
  revaStaked: new Big(0),
  lockPeriod: 0,
};

/** Styled Components */
const Root = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 45px;
`;

const Items = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProgressBarContainer = styled.div`
  progress[value] {
    width: 100%;
    height: 0.625rem;
    -webkit-appearance: none;
    appearance: none;
  }

  // Webkit
  progress[value]::-webkit-progress-bar {
    background-color: #0a0c18;
    border-radius: 3.125rem;
  }
  progress[value]::-webkit-progress-value {
    background: linear-gradient(126.66deg, #5f2eea 14.36%, #972eea 99.39%);
    border-radius: 3.125rem;
  }

  // Moz
  progress[value]::-moz-progress-bar {
    background-color: #0a0c18;
    border-radius: 3.125rem;
  }
  progress[value]::-moz-progress-value {
    background: linear-gradient(126.66deg, #5f2eea 14.36%, #972eea 99.39%);
    border-radius: 3.125rem;
  }
`;
