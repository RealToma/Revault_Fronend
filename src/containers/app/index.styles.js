import styled from "styled-components";
import { colorGrayscaleDark } from "../../colors";

export const Root = styled.div`
  position: relative;
  height: 100vh;
`;

export const Background = styled.div`
  position: fixed;
  left: 0;
  right: 0px;
  top: 0px;
  bottom: 0px;
  background-color: ${colorGrayscaleDark};
  overflow: hidden;
`;

export const Circle = styled.img`
  position: fixed;
  right: 0px;
  bottom: 0px;
  width: 1256px;
  height: 822px;
`;
