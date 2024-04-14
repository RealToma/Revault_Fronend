import React from "react";
import PropTypes from "prop-types";

import { Root } from "./index.styles";

export default function TokenPairContainer({ children }) {
  return <Root>{children}</Root>;
}

TokenPairContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
