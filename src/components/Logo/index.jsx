import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as RevaultLogo } from "../../assets/Logo/logo-with-title.svg";

export default function Logo({ width = 120, height = 80 }) {
  return <RevaultLogo width={width} height={height} />;
}

Logo.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
