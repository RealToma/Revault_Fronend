import React from "react";
import PropTypes from "prop-types";
import Big from "big.js";

import { coinLogo, TOKEN_DESCRIPTION } from "../../helpers/utils";

import NumberFormatter from "../NumberFormatter";

import { Root, Content, Title, Subtitle, TokenIcon } from "./TokenCard.styles";

export default function TokenCard({ data, onClick }) {
  const symbol = data.tokenDetails.symbol;
  const code = data.tokenDetails.codes[0];

  return (
    <Root onClick={() => onClick(data)}>
      <TokenIcon src={coinLogo(code)} />
      <Content>
        <Title>
          <span>{`${symbol}`}</span>
          <NumberFormatter value={data.balance} />
        </Title>
        <Subtitle>
          <span>{`${TOKEN_DESCRIPTION[code]}`}</span>
          <NumberFormatter
            value={new Big(data.balance).times(new Big(data.valuePerToken))}
            prefix="$"
          />
        </Subtitle>
      </Content>
    </Root>
  );
}

TokenCard.propTypes = {
  data: PropTypes.object,
  onClick: PropTypes.func,
};
