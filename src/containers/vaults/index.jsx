import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMetamask } from "use-metamask";
import ContentLoader from "react-content-loader";

import { loadVaults } from "../../actions";
import { Root } from "./index.styles";
import Header from "../../components/Header";
import TokenPair from "../../components/TokenPair";
import TokenPairContainer from "../../components/TokenPairContainer";
import WelcomeHeader from "../../components/WelcomeHeader";
import PositionSidePane from "../../components/PositionSidePane";
import VaultsScreenLoader from "./VaultsScreenLoader";
import { colorGrayscaleTitleActive } from "../../colors";

export default function Vaults() {
  const { metaState } = useMetamask();
  const dispatch = useDispatch();
  const vaultsState = useSelector((state) => state.vaultsState);
  const isConnected = metaState.isConnected;

  const [selectedTokenId, setSelectedTokenId] = useState();

  useEffect(() => dispatch(loadVaults(isConnected)), [dispatch, isConnected]);

  const vaults = vaultsState.data?.allPositions || [];
  const exchangeRatesMap = vaultsState.data?.exchangeRatesMap;

  return (
    <Root>
      <Header isConnected={isConnected} />
      <WelcomeHeader />
      {vaultsState.isInitialized ? (
        <>
          <TokenPairContainer>
            {vaults.map((v, index) => {
              return (
                <TokenPair
                  key={`vault-pair-${index}`}
                  data={v}
                  exchangeRatesMap={exchangeRatesMap}
                  isConnected={isConnected}
                  onEnterPosition={(p) => setSelectedTokenId(p.tokenId)}
                />
              );
            })}
          </TokenPairContainer>
          <PositionSidePane
            data={vaults.find((v) => v.tokenId === selectedTokenId)}
            isConnected={isConnected}
            isOpen={selectedTokenId !== undefined}
            onCloseClicked={() => setSelectedTokenId()}
          />
        </>
      ) : (
        <>
          <TokenPairContainer>
            {Array.from({ length: 6 }, (v, index) => (
              <VaultLoader key={`${index}`} />
            ))}
          </TokenPairContainer>
          <VaultsScreenLoader />
        </>
      )}
    </Root>
  );
}

const VaultLoader = () => (
  <ContentLoader
    speed={2}
    width={300}
    height={330}
    viewBox="0 0 300 330"
    backgroundColor="rgba(38, 43, 69, 0.4)"
    foregroundColor="rgba(255, 255, 255, 0.1)"
    style={{
      backgroundColor: colorGrayscaleTitleActive,
      borderRadius: 10,
    }}
  >
    <rect x="15" y="26" rx="0" ry="0" width="168" height="25" />
    <rect x="204" y="15" rx="0" ry="0" width="80" height="47" />
    <circle cx="152" cy="108" r="11" />
    <rect x="15" y="81" rx="0" ry="0" width="110" height="18" />
    <rect x="185" y="82" rx="0" ry="0" width="99" height="18" />
    <rect x="41" y="170" rx="4" ry="4" width="245" height="20" />
    <rect x="41" y="195" rx="4" ry="4" width="179" height="20" />
    <rect x="41" y="220" rx="4" ry="4" width="71" height="20" />
    <rect x="15" y="259" rx="0" ry="0" width="93" height="16" />
    <rect x="15" y="278" rx="0" ry="0" width="93" height="20" />
    <rect x="15" y="301" rx="0" ry="0" width="44" height="14" />
    <circle cx="25" cy="180" r="10" />
    <circle cx="25" cy="205" r="10" />
    <circle cx="25" cy="230" r="10" />
    <rect x="15" y="147" rx="0" ry="0" width="100" height="16" />
    <rect x="224" y="105" rx="0" ry="0" width="60" height="35" />
    <rect x="15" y="105" rx="0" ry="0" width="60" height="35" />
  </ContentLoader>
);
