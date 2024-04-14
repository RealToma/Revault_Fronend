import React from "react";
import PropTypes from "prop-types";

import MDSpinner from "react-md-spinner";
import { colorGrayscaleOffWhite } from "../../colors";

export default function LoadingSpinner({ size = 24, ...props }) {
  return (
    <MDSpinner
      singleColor={colorGrayscaleOffWhite}
      size={size}
      borderSize={2}
      {...props}
    />
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.number,
};
