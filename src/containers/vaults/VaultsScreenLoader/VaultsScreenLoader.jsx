import React, { useEffect } from "react";
import lottie from "lottie-web";
import data from "../../../assets/vaults-screen-loader/data.json";
import styled from "styled-components";
import { ReactComponent as VaultsSkeleton } from "../../../assets/vaults-screen-loader/vaults-skeleton.svg";

export default function VaultsScreenLoader() {
  useEffect(() => {
    lottie.loadAnimation({
      container: document.getElementById("vaults-screen-loader-container"), // the dom element that will contain the animation: ;
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: data,
    });
  }, []);

  return (
    <>
      <VaultsSkeleton />
      <VaultsScreenLoaderContainer id="vaults-screen-loader-container" />
    </>
  );
}

const VaultsScreenLoaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
