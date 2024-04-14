import React, { useState } from "react";
import PropTypes from "prop-types";

import { Root } from "./index.styles";

export default function Modal({ trigger, content, isOpenInitial = false }) {
  const [isOpen, setIsOpen] = useState(isOpenInitial);

  return (
    <>
      {trigger &&
        React.cloneElement(trigger, { onClick: () => setIsOpen(true) })}
      {isOpen && (
        <Root onClick={() => setIsOpen(false)}>
          {React.cloneElement(content, { onClick: (e) => e.stopPropagation() })}
        </Root>
      )}
    </>
  );
}

Modal.propTypes = {
  trigger: PropTypes.node,
  content: PropTypes.node,
  isOpenInitial: PropTypes.bool,
};
