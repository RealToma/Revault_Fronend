import React from "react";
import PropTypes from "prop-types";

import LoadingSpinner from "../LoadingSpinner";

import { Root, Container, SideSpinnerContainer } from "./index.styles";

export default function Button({
  children,
  text = null,
  prefix = null,
  suffix = null,
  onClick,
  outline = false,
  disabled = false,
  loading = false,
  loadingText,
  spinnerSize,
  ...props
}) {
  return (
    <Root
      onClick={() => {
        !disabled && !loading ? onClick && onClick() : undefined;
      }}
      $outline={outline}
      $disabled={disabled || loading}
      {...props}
    >
      <Container>
        {loading ? (
          loadingText ? (
            <>
              {loadingText}
              <SideSpinnerContainer>
                <LoadingSpinner size={spinnerSize} />
              </SideSpinnerContainer>
            </>
          ) : (
            <LoadingSpinner size={spinnerSize} />
          )
        ) : (
          <>
            {prefix}
            {children || text}
            {suffix}
          </>
        )}
      </Container>
    </Root>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  text: PropTypes.node,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  onClick: PropTypes.func,
  outline: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  spinnerSize: PropTypes.number,
};
