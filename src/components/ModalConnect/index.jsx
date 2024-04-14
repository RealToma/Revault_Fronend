import React, { useEffect } from "react";
import usePortal from "react-cool-portal";
import PropTypes from "prop-types";
import { useMetamask } from "use-metamask";
import { useWeb3React } from "@web3-react/core";
import { getShortTxHash } from "../../helpers/utils";

import Button from "../Button";

import { Root, MetaMaskInfo, PlusIcon } from "./index.styles";

import plus from "../../assets/plus.png";
import MetaMaskConnect from "./MetaMaskConnect";

const addresses = require("../../config/config").config.getNetworkAddresses();

export default function ModalConnect({ isConnected, customButton }) {
  const { Portal, isShow, show, hide } = usePortal({
    defaultShow: false,
    clickOutsideToHide: false,
  });
  const { account, active, error, deactivate } = useWeb3React();

  useEffect(() => {
    if (isShow && isConnected) {
      hide();
    }
  }, [isConnected, isShow, hide]);

  console.log(account);

  const { metaState } = useMetamask();

  if (active) {
    const chainId = metaState.chain?.id || -1;
    const chainName = addresses?.chains?.find(
      (c) => c.chainId === parseInt(chainId),
    )?.chainName;
    return (
      <Root>
        <MetaMaskInfo>
          <MetaMaskInfo.Chain>{`${
            chainName || metaState.chain.name
          }`}</MetaMaskInfo.Chain>
          <MetaMaskInfo.Address>
            {getShortTxHash(account, 8)}
          </MetaMaskInfo.Address>
        </MetaMaskInfo>
        {/* <MetaMaskIcon src={metamask} /> */}
      </Root>
    );
  }

  return (
    <>
      {React.cloneElement(customButton || DefaultConnectButton, {
        onClick: show,
      })}

      <Portal>
        <MetaMaskConnect onClose={hide} />
      </Portal>
    </>
  );
}

const DefaultConnectButton = (
  <Button text="Connect Wallet" suffix={<PlusIcon src={plus} />} />
);

ModalConnect.propTypes = {
  isConnected: PropTypes.bool,
  customButton: PropTypes.element,
};
