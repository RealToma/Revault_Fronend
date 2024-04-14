import styled from "styled-components";

import Color from "color";
import { colorGrayscaleTitleActive } from "../../colors";

export const Root = styled.div`
  position: relative;
  width: 82px;
  height: 47px;
  box-shadow: 0 0 0 3px ${Color(colorGrayscaleTitleActive).alpha(0.2)};
  background-color: ${Color(colorGrayscaleTitleActive).alpha(0.2)};
  border-radius: 10px;
`;

const Coin = styled.div`
  position: absolute;
`;

export const LeftCoin = styled(Coin)`
  left: 0;
`;

export const RightCoin = styled(Coin)`
  right: 0;
`;
