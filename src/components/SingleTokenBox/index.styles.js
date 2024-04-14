import styled from "styled-components";

import { colorGrayscaleDark } from "../../colors";

export const Root = styled.div`
  position: relative;
  display: grid;
  place-content: center;
  width: 47px;
  height: 47px;
  background-blend-mode: multiply;
`;

export const Logo = styled.img`
  width: 35px;
  height: 35px;
  object-fit: contain;
  z-index: 1;

  -webkit-mask-size: 100%;
  mask-size: 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
`;

export const Background = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${(props) => props.color || colorGrayscaleDark};
  border-radius: 10px;
  opacity: ${(props) => (props.color ? 1.0 : 0.6)}; ;
`;
