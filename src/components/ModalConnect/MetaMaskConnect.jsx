import React, { useRef } from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import { Grid, Box } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";

import { useOnClickOutside } from "../../helpers/hooks";

import { web3SessionKey } from "../../constants";

import { Content } from "./MetaMaskConnect.styles";

import {
  injected,
  walletConnect,
  trustWallet,
  CoinbaseWallet,
} from "../../utils/connectors";
import WalletCard from "./WalletCard";

const DESKTOP_CONNECTORS = {
  MetaMask: injected,
  WalletConnect: walletConnect,
  CoinbaseWallet: CoinbaseWallet,
  BinanceChain: trustWallet,
  TrustWallet: trustWallet,
};

const MOBILE_CONNECTORS = {
  MetaMask: injected,
  TrustWallet: trustWallet,
  BinanceChain: trustWallet,
};

export default function MetaMaskConnect({ onClose }) {
  const ref = useRef();
  const { connector, activate } = useWeb3React();
  // const isSm = useMediaQuery(theme.breakpoints.down('sm'), { defaultMatches: true });

  const walletConnectors = DESKTOP_CONNECTORS;

  const walletSelectHandler = (currentConnector) => {
    activate(currentConnector);
    onClose();
  };

  useOnClickOutside(ref, onClose);

  return (
    <Content ref={ref}>
      <Content.Title>Connect your wallet</Content.Title>
      <Content.Subtitle>
        Maximize your APY by rebalancing your position between the best matching
        vaults
      </Content.Subtitle>
      <Box display="flex" flexDirection="column">
        {Object.keys(walletConnectors).map((name) => {
          const currentConnector = walletConnectors[name];
          return (
            <Box
              key={name}
              item
              xs={12}
              display="flex"
              flex="1"
              justifyItems="flex-start"
              marginTop="20px"
              width="400px"
              onClick={() => walletSelectHandler(currentConnector)}
            >
              <WalletCard
                selected={currentConnector === connector}
                name={name}
              />
            </Box>
          );
        })}
      </Box>
      {/* <Content.Frame
        onClick={async () => {
          onClose();
          if (metaState.isAvailable) {
            await web3Connect(connect);
          } else {
            const win = window.open("https://metamask.io/", "_blank");
            if (win != null) {
              win.focus();
            }
          }
        }}
      >
        <Content.Icon src={metamask} />
        <Content.BrandName>Metamask</Content.BrandName>
      </Content.Frame> */}
    </Content>
  );
}

export async function web3Connect(connect) {
  try {
    await connect(ethers.providers.Web3Provider, "any");
    localStorage.setItem(web3SessionKey, true);
  } catch (error) {
    console.log(error);
  }
}

MetaMaskConnect.propTypes = {
  onClose: PropTypes.func,
};
