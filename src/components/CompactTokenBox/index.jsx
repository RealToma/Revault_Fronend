import React from "react";
import PropTypes from "prop-types";

import { coinLogo } from "../../helpers/utils";

import { Root, TokenIcon } from "./index.styles";

export default function CompactTokenBox({ tokens = [] }) {
  return (
    <Root>
      {tokens.map((t, index) => {
        const showLargeIcon = tokens.length === 1; // only one token to show
        return (
          <TokenIcon
            key={`token-icon-${index}`}
            src={coinLogo(t)}
            css={showLargeIcon ? "height: 35px; width: 35px;" : undefined}
          />
        );
      })}
    </Root>
  );
}

CompactTokenBox.propTypes = {
  tokens: PropTypes.array,
};
