import React from "react";

import { Root, Chevron, Stripe } from "./ClosingStripe.styles";

import chevronDown from "../../assets/chevron-down.png";

export default function ClosingStripe() {
  return (
    <Root>
      <Stripe />
      <Chevron src={chevronDown} />
      <Stripe />
    </Root>
  );
}
