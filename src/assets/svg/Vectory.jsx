import React from "react";
import PropTypes from "prop-types";

import { colorSuccessDarkmode, colorErrorDefault } from "../../colors";

export default function Vector({ isBull }) {
  return (
    <svg
      width="12"
      height="6"
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.25 5.25L3.25 2.75L5.25 5.25L8.75 0.75L10.75 2.75"
        stroke={isBull ? colorSuccessDarkmode : colorErrorDefault}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

Vector.propTypes = {
  isBull: PropTypes.bool,
};
