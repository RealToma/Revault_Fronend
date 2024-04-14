import React from "react";
import PropTypes from "prop-types";

import {
  Root,
  LogoContainer,
  VersionLabel,
  ExternalLink,
} from "./index.styles";
import NavMenu from "../NavMenu";
import Logo from "../Logo";
import ModalConnect from "../ModalConnect";

import { APP_MAIN_URL } from "../../constants";

export default function Header({ isConnected }) {
  return (
    <Root>
      <ExternalLink href={APP_MAIN_URL}>
        <LogoContainer>
          <Logo />
          <VersionLabel>BETA</VersionLabel>
        </LogoContainer>
      </ExternalLink>

      <NavMenu />
      <ModalConnect isConnected={isConnected} />
    </Root>
  );
}

Header.propTypes = {
  isConnected: PropTypes.bool,
};
