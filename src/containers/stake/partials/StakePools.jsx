import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Divider from "@components/Divider";
import InfoItem from "@components/InfoItem";
import { colorPrimaryDark, colorPrimaryDefault } from "@src/colors";
import { colorGrayscaleOffWhite } from "../../../colors";
import { POOL_TIERS } from "../../../helpers/utils";
import NumberFormatter from "../../../components/NumberFormatter";

export default function StakePools({
  userPositions,
  pools,
  selectedPool,
  onSelect,
  disableNonStakedPools,
}) {
  const {
    apy,
    lockPeriod,
    multiplier: selectedPoolSymbol,
    totalRevaStaked,
  } = pools[selectedPool];
  const powerShareTier = POOL_TIERS[selectedPoolSymbol];

  const lockPeriodInDays = lockPeriod / 60 / 60 / 24;

  return (
    <Container>
      <Info>
        <InfoItem
          title={<NumberFormatter value={apy} suffix="%" withToolTip />}
          subtitle="Reva Apr"
        />
        <Divider />
        <InfoItem title={powerShareTier} subtitle="Power Share" />
        <Divider />
        <InfoItem title={lockPeriodInDays} subtitle="Days Lock" />
        <Divider />
        <InfoItem
          title={<NumberFormatter value={totalRevaStaked} withToolTip />}
          subtitle="Total Reva Staked"
        />
      </Info>
      <Controls>
        <HR />
        {pools.map((pool, index) => {
          const { multiplier } = pool;
          const staked = userPositions
            ? userPositions[index]?.revaStaked
            : undefined;
          const disabled = disableNonStakedPools && staked.eq(0);
          return (
            <BoostButton
              key={multiplier}
              highlight={staked > 0}
              onClick={() => (!disabled ? onSelect(index) : null)}
              selected={selectedPoolSymbol === multiplier}
            >
              <RadioButton
                type="radio"
                id={multiplier}
                name="boost-options"
                value={multiplier}
                checked={selectedPoolSymbol === multiplier}
                readOnly
                disabled={disabled}
              />
              <label htmlFor={multiplier}>x{multiplier}</label>
            </BoostButton>
          );
        })}
      </Controls>
    </Container>
  );
}

StakePools.propTypes = {
  pools: PropTypes.array.isRequired,
  userPositions: PropTypes.array,
  selectedPool: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  disableNonStakedPools: PropTypes.bool,
};

/** Styled Components */
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 0 1rem 0;
`;

const Controls = styled(Container)`
  position: relative;
  flex-direction: row;
  align-items: center;
`;

const Info = styled(Controls)``;

const RadioButton = styled.input.attrs({
  type: "radio",
})`
  display: none;
  :checked + label {
    /* display: inline-block;
    border-radius: 15px;
    background-color: ${colorPrimaryDefault}; */
    color: ${colorGrayscaleOffWhite};
    /* cursor: default; */
  }
  :disabled + label {
    cursor: default;
  }
  /* :active + label {
    background-color: ${colorPrimaryDefault};
    color: ${colorGrayscaleOffWhite};
  } */
`;

const BoostButton = styled.div`
  z-index: 10;
  min-width: 48.58px;
  min-height: 40px;
  max-width: 48.58px;
  max-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${(props) =>
    props.highlight
      ? `5px solid rgba(95, 46, 234, 0.3);`
      : "1px solid rgba(61, 0, 162, 0.4)"};
  box-sizing: border-box;
  border-radius: 10px;
  padding: 10px;
  background-color: ${(props) =>
    props.selected
      ? colorPrimaryDefault
      : "#220a56"}; // Does not appear in color pallete
  cursor: pointer;

  label {
    display: inline-block;
    color: ${(props) =>
      props.highlight ? colorGrayscaleOffWhite : colorPrimaryDefault};
    cursor: inherit;
  }

  &:hover {
    border: 1px solid ${colorPrimaryDefault};
    border-radius: 14px;
  }

  &:disabled {
    color: ${colorPrimaryDefault};
    border: none;
    cursor: none;
  }

  /* &:focus {
    background-color: ${colorPrimaryDefault};
    color: ${colorGrayscaleOffWhite};
  } */
`;

const HR = styled.hr`
  position: absolute;
  width: 405.08px;
  height: 0px;
  left: 10.74px;
  top: 11px;
  opacity: 0.4;
  border: 1px solid ${colorPrimaryDark};
`;
