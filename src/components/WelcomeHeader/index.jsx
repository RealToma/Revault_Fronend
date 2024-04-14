import React from "react";
import PropTypes from "prop-types";

import { Root, Title, Subtitle, PlayIcon, PlayButton } from "./index.styles";

import play from "../../assets/button_play.png";

export default function WelcomeHeader() {
  return (
    <Root>
      <Title>We Rebalance Vaults</Title>
      <Subtitle>
        Maximize your APY by rebalancing your position between the best matching
        vaults
      </Subtitle>
      <PlayButton
        text="How it works"
        prefix={<PlayIcon src={play} />}
        onClick={() => {
          window.open("https://www.youtube.com/watch?v=yMG7XXPOrjE");
        }}
      />
    </Root>
  );
}

WelcomeHeader.propTypes = {
  coin: PropTypes.string,
  active: PropTypes.bool,
  marked: PropTypes.bool,
};
