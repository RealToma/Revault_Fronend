import React from "react";
import PropTypes from "prop-types";
import SingleTokenBox from "../SingleTokenBox";

import { Root, LeftCoin, RightCoin } from "./index.styles";

export default function DoubleTokenBox({ coins = [], background }) {
  return (
    <Root className="blend">
      <RightCoin>
        <SingleTokenBox coin={coins[1]} background={background} withMask />
      </RightCoin>
      <LeftCoin>
        <SingleTokenBox coin={coins[0]} background={background} />
      </LeftCoin>
    </Root>
  );
}

DoubleTokenBox.propTypes = {
  coins: PropTypes.array,
  background: PropTypes.string,
};
