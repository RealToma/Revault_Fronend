import React, { useRef } from "react";
import PropTypes from "prop-types";
import usePortal from "react-cool-portal";
import { useOnClickOutside } from "@src/helpers/hooks";
import { Content } from "@components/ModalConnect/MetaMaskConnect.styles"; // Move to modal components
import { ReactComponent as XCircleIcon } from "@assets/icons/x-circle.svg";
import { ReactComponent as XIcon } from "@assets/icons/x.svg";

import {
  colorErrorDefault,
  colorGrayscaleDark,
  colorGrayscaleBody,
  colorGrayscaleOffWhite,
  colorPrimaryDark,
} from "@src/colors";
import styled from "styled-components";
import {
  ActionButton,
  ActionButtons,
  InlineText,
  Paragraph,
} from "../../common/styles";
import { StakeModes } from "../StakeScreen";
import LoadingSpinner from "@components/LoadingSpinner";
import { colorGrayscaleLabel, colorPrimaryDefault } from "../../../colors";

export default function StakeConfirmModal({
  type,
  onConfirm,
  locked,
  loading,
  disabled,
  lockPeriod,
}) {
  const { Portal, show, hide } = usePortal({
    defaultShow: false,
    clickOutsideToHide: false,
  });
  const ref = useRef();
  useOnClickOutside(ref, () => hide());

  const subtitle =
    type === StakeModes.Stake ? (
      <Paragraph color={colorGrayscaleLabel}>
        Staking more REVA into already active pool will{" "}
        <InlineText color={colorErrorDefault}>RESET</InlineText> the lock timer
        to {lockPeriod / 60 / 60 / 24} days, are you sure?
      </Paragraph>
    ) : (
      <Paragraph color={colorGrayscaleLabel}>
        Unstake REVA before the lock timer has ended will trigger{" "}
        <InlineText color={colorErrorDefault}>25%</InlineText> withdrawal fee,
        are you sure?
      </Paragraph>
    );

  const getBtnBackground = () => {
    switch (type) {
      case StakeModes.Stake:
        return colorPrimaryDefault;
      case StakeModes.Unstake:
        if (locked) {
          return colorErrorDefault;
        } else {
          return colorPrimaryDefault;
        }
    }
  };

  return (
    <>
      <ActionButton
        text={
          loading ? (
            <LoadingSpinner />
          ) : type === StakeModes.Stake ? (
            "Stake"
          ) : (
            "Unstake & Claim"
          )
        }
        loadingText={type === StakeModes.Stake ? "Staking..." : "Unstaking..."}
        loading={loading}
        background={getBtnBackground}
        color={colorGrayscaleOffWhite}
        onClick={locked ? show : onConfirm}
        disabled={disabled}
        outline={disabled ? colorGrayscaleBody : undefined}
      />
      <Portal>
        <Content ref={ref}>
          <CloseBtn onClick={hide} />
          <WarningIcon />
          <Content.Title>{String(type)} Warning!</Content.Title>
          <Content.Subtitle>{subtitle}</Content.Subtitle>
          <ActionButtons>
            <CustomActionButton
              text="Cancel"
              background={colorGrayscaleDark}
              outline={colorGrayscaleBody}
              onClick={hide}
            />
            <CustomActionButton
              text={
                type === StakeModes.Stake ? "Yes, Reset Timer" : "Yes, Unstake"
              }
              background={colorErrorDefault}
              color={colorGrayscaleOffWhite}
              onClick={() => {
                onConfirm();
                hide();
              }}
            />
          </ActionButtons>
        </Content>
      </Portal>
    </>
  );
}

StakeConfirmModal.propTypes = {
  type: PropTypes.string.isRequired,
  locked: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  lockPeriod: PropTypes.number,
};

/** Styled Components */
const CloseBtn = styled(XIcon)`
  cursor: pointer;
  margin-left: auto;
  margin-top: -20px;
`;
const WarningIcon = styled(XCircleIcon)`
  width: 114px;
  height: 114px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const CustomActionButton = styled(ActionButton)`
  border: ${(props) =>
    props.outline ? `1px solid ${props.outline}` : undefined};
  :hover {
    background-color: ${(props) => props.background || colorPrimaryDark};
  }
`;
