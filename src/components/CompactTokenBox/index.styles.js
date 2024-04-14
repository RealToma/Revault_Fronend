import styled from "styled-components";

import { colorGrayscaleDark } from "../../colors";

export const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  border-radius: 10px;
  background-color: ${colorGrayscaleDark};
`;

export const TokenIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;
