import styled from "styled-components";

import {
  colorPrimaryDefault,
  colorGrayscaleOffWhite,
  colorPrimaryDark,
} from "../../colors";

export const Root = styled.button`
  position: relative;
  display: grid;
  place-content: center;
  border-radius: 5px;
  height: 40px;
  background-color: ${(props) =>
    props.$outline
      ? "transparent"
      : props.backgroundColor || colorPrimaryDefault};
  color: ${(props) =>
    props.$outline
      ? props.backgroundColor || colorPrimaryDefault
      : props.textColor || colorGrayscaleOffWhite};
  font-weight: 600;
  font-size: 12px;
  padding: 0px 10px;
  user-select: none;
  cursor: ${(props) => (props.$disabled ? "none" : "pointer")};
  border-style: hidden;
  border: 1px solid
    ${(props) =>
      props.$outline
        ? props.backgroundColor || colorPrimaryDefault
        : "transparent"};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1.0)};
  pointer-events: ${(props) => (props.$disabled ? "none" : "unset")};

  :hover {
    background-color: ${(props) =>
      props.backgroundColor ||
      (props.$disabled ? colorPrimaryDefault : colorPrimaryDark)};
    opacity: ${(props) =>
      props.$disabled
        ? 0.5
        : props.backgroundColor
        ? props.loading
          ? 1.0
          : 0.6
        : 1.0};
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const SideSpinnerContainer = styled.div`
  position: absolute;
  right: 16px;
`;
