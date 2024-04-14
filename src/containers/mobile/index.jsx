import React, { useEffect } from "react";
import PropTypes from "prop-types";
import lottie from "lottie-web";
import data from "../../assets/mobile-screen-animation/data.json";
import styled from "styled-components";
import {
  colorGrayscaleBody,
  colorGrayscaleLabel,
  colorGrayscaleOffWhite,
  colorPrimaryDefault,
} from "../../colors";
import { Root } from "../../components/ToolTip/index.styles";
import Logo from "../../components/Logo";
import { ActionButton, ActionButtons } from "../common/styles";
import InfoItem from "../../components/InfoItem/InfoItem";
import { APP_MAIN_URL } from "../../constants";

export default function MobileView({ onDesktopVersion }) {
  useEffect(() => {
    lottie.loadAnimation({
      container: document.getElementById("mobile-screen-animation"), // the dom element that will contain the animation: ;
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: data,
    });
  }, []);

  const redirect = () => {
    window.location.assign(APP_MAIN_URL);
  };

  return (
    <Root>
      <Body>
        <Header>
          <Logo rootCSS="width: auto;" />
          <HeaderText>Beta</HeaderText>
        </Header>
        <LogoTriangle id="mobile-screen-animation" />
        <InfoItem
          title="Mobile Support Coming Soon"
          subtitle="Currently we are not supporting mobile devices. stay tuned."
          titleStyle="font-size: 20px; font-weight: bold; line-height: 35px;"
          subtitleStyle="font-size: 16px; text-transform: none "
        />
        <ActionButtons css="flex-direction: column; gap: 15px;">
          <ActionButton
            text={"Desktop Version"}
            color={colorGrayscaleOffWhite}
            css="flex: none;"
            onClick={onDesktopVersion}
          />
          <ActionButton
            text={"More Info"}
            outline={colorPrimaryDefault}
            background="none"
            css="flex: none;"
            onClick={redirect}
          />
        </ActionButtons>
      </Body>
    </Root>
  );
}

MobileView.propTypes = {
  onDesktopVersion: PropTypes.func,
};

const Body = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 75vw;
  padding-top: 30px;
`;

const Header = styled.div`
  color: ${colorGrayscaleBody};
  display: flex;
  gap: 10px;
  align-items: center;
`;

const LogoTriangle = styled.div`
  height: 380px;
  width: 100vw;
`;

const HeaderText = styled.div`
  color: ${colorGrayscaleLabel};
  border-radius: 20px;
  padding: 5px;
  font-size: 12px;
`;
