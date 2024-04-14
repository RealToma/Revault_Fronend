import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { Subtitle } from "@components/TokenSelect/TokenCard.styles";
import { colorPrimaryDefault, colorGrayscaleOffWhite } from "@src/colors";
import vIcon from "@src/assets/check-circle.png";
import xIcon from "@src/assets/x-circle.png";
import loaderIcon from "@src/assets/loader.png";
import { NOTIFICATION_TYPES } from "@src/constants";
import { BSC_SCAN_TX_LINK, METAMASK_API_ERROR_TYPES } from "../../constants";
import { activateNotification } from "../../utils";
import { getShortTxHash } from "../../helpers/utils";

const confirmationMessage = "Transaction confirmed";
const rejectedMessage = "User denided transaction signature";
const failededMessage = "Transaction failed";
const pendingMessage = "Waiting for confirmation";
const generalErrorMessage = "An error occurred, please try again";

export default function TransactionNotification({ txHash, notificationType }) {
  const shortenTxHash =
    notificationType === NOTIFICATION_TYPES.REJECTED ||
    notificationType === NOTIFICATION_TYPES.GENERAL_ERROR
      ? txHash
      : getShortTxHash(txHash);

  const bscscanLink = BSC_SCAN_TX_LINK + txHash;

  const notificationData =
    notificationType === NOTIFICATION_TYPES.CONFIRMED
      ? { imgSrc: vIcon, subtitle: confirmationMessage, href: bscscanLink }
      : notificationType === NOTIFICATION_TYPES.PENDING
      ? { imgSrc: loaderIcon, subtitle: pendingMessage, href: bscscanLink }
      : notificationType === NOTIFICATION_TYPES.REJECTED
      ? { imgSrc: xIcon, subtitle: rejectedMessage, href: undefined }
      : notificationType === NOTIFICATION_TYPES.GENERAL_ERROR
      ? { imgSrc: xIcon, subtitle: generalErrorMessage, href: undefined }
      : { imgSrc: xIcon, subtitle: failededMessage, href: bscscanLink };

  const { imgSrc, subtitle, href } = notificationData;
  return (
    <NotificationContainer>
      <NotificationIcon
        src={imgSrc}
        animate={notificationType === NOTIFICATION_TYPES.PENDING}
      />
      <div>
        <NotificationTitle>{shortenTxHash}</NotificationTitle>
        <NotificationSubtitle>{subtitle}</NotificationSubtitle>
        {href ? (
          <NotificationLink
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on bscscan
          </NotificationLink>
        ) : null}
      </div>
    </NotificationContainer>
  );
}

TransactionNotification.propTypes = {
  txHash: PropTypes.string,
  notificationType: PropTypes.string,
};

export const activateErrorNotification = (error) => {
  if (error.code === METAMASK_API_ERROR_TYPES.USER_REJECT) {
    // Currently we treat only this exception type from MetaMask
    // https://docs.metamask.io/guide/ethereum-provider.html#errors
    activateNotification({
      txHash: "MetaMask Tx Signature", // usually we use the txHash as a title, but here we don't have a txHash, so a placeholder is provided
      notificationType: NOTIFICATION_TYPES.REJECTED,
    });
  } else {
    activateNotification({
      txHash: "MetaMask Error Occurred", // usually we use the txHash as a title, but here we don't have a txHash, so a placeholder is provided
      notificationType: NOTIFICATION_TYPES.GENERAL_ERROR,
    });
  }
};

const NotificationContainer = styled.div`
  display: flex;
  width: 100%;
`;

const NotificationTitle = styled.div`
  color: ${colorGrayscaleOffWhite};
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
`;

const NotificationSubtitle = styled(Subtitle)`
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
`;
const NotificationLink = styled.a`
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${colorPrimaryDefault};
  text-decoration: underline;
`;

const spinningAnimation = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}`;

const NotificationIcon = styled.img`
  margin-right: 5px;
  animation-name: ${(props) => (props.animate ? spinningAnimation : undefined)};
  animation-duration: 3.5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;
