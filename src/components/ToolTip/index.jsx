import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import {
  Root,
  Box,
  Arrow,
  orientationTop,
  orientationBottom,
} from "./index.styles";

export default function ToolTip({
  children,
  text,
  orientation = orientationBottom,
  ...props
}) {
  const [show, setShow] = React.useState(false);

  return (
    <Root>
      {!_.isEmpty(text) && (
        <Box show={show} orientation={orientation}>
          {text}
          <Arrow orientation={orientation} />
        </Box>
      )}
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        {...props}
      >
        {children}
      </div>
    </Root>
  );
}

ToolTip.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  orientation: PropTypes.oneOf([orientationTop, orientationBottom]),
};
