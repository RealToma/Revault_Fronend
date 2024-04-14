import styled from "styled-components";
import { colorGrayscaleBody, colorGrayscaleOffWhite } from "../../colors";

export const orientationTop = "top";
export const orientationBottom = "bottom";

export const Root = styled.div`
  position: relative;
`;

export const Box = styled.div`
  position: absolute;
  background: ${colorGrayscaleBody};
  color: ${colorGrayscaleOffWhite};
  padding: 10px;
  border-radius: 10px;
  top: ${(props) =>
    props.orientation === orientationBottom ? "calc(100% + 5px)" : "unset"};
  bottom: ${(props) =>
    props.orientation === orientationBottom ? "unset" : "calc(100% + 5px)"};
  display: ${(props) => (props.show ? "visible" : "none")};
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  z-index: 1;
`;

export const Arrow = styled.span`
  position: absolute;
  top: ${(props) =>
    props.orientation === orientationBottom ? "-10px" : "unset"};
  bottom: ${(props) =>
    props.orientation === orientationBottom ? "undet" : "-10px"};
  left: 10px;
  border-width: 5px;
  border-style: solid;
  border-color: ${(props) =>
    props.orientation === orientationBottom
      ? `transparent transparent ${colorGrayscaleBody} transparent`
      : `${colorGrayscaleBody} transparent transparent transparent`};
  z-index: 1;
`;
