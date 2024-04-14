import React from "react";
import PropTypes from "prop-types";
import { Root, Background, Logo } from "./index.styles";

import { coinLogo } from "../../helpers/utils";

import mask from "../../assets/single-coin-box-mask.png";

export default function SingleTokenBox({
  coin,
  background,
  withMask,
  ...props
}) {
  const maskImage = withMask ? `url(${mask})` : "none";
  return (
    <Root {...props}>
      <Background
        color={background}
        style={{ maskImage: maskImage, WebkitMaskImage: maskImage }}
      />
      <Logo
        src={coinLogo(coin, true)}
        style={{ maskImage: maskImage, WebkitMaskImage: maskImage }}
      />
    </Root>
  );
}

SingleTokenBox.propTypes = {
  coin: PropTypes.string,
  background: PropTypes.string,
  withMask: PropTypes.bool,
};
