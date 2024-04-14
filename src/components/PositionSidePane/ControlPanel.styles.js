import styled from "styled-components";

import Button from "../Button";

import {
  colorGrayscaleBody,
  colorGrayscaleDark,
  colorGrayscaleOffWhite,
  colorPrimaryDefault,
} from "../../colors";

export const Root = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background-color: red;

  z-index: 2;

  .container {
    display: flex;
    flex-direction: column;
    background-color: ${colorGrayscaleDark};
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
    will-change: transform, height;
  }
`;

export const HoverArea = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 130px;
  pointer-events: ${(props) => (props.isExpanded ? "none" : "unset")};

  z-index: 4;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: ${colorGrayscaleOffWhite};
  margin-top: 30px;
  margin-bottom: 16px;
`;

Title.Suffix = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
  color: ${(props) =>
    props.isHighlighted ? colorGrayscaleOffWhite : colorGrayscaleBody};
`;

Title.Close = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
  user-select: none;
  cursor: pointer;

  :hover {
    opacity: 0.5;
  }
`;

export const ButtonContainer = styled.div`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;

  background-color: ${colorGrayscaleDark};

  z-index: 3;
`;

export const ButtonSpacer = styled.div`
  width: 15px;
`;

export const ActionButton = styled(Button)`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  border-radius: 10px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
`;

export const AltButton = styled(ActionButton)`
  position: relative;
  flex: ${(props) => props.flex || 1};
  width: ${(props) => props.width || 60}px;
  border: 1px solid ${colorGrayscaleBody};
  color: ${colorPrimaryDefault};
  background-color: transparent;

  :hover {
    background-color: ${colorGrayscaleDark};
    color: #fff;
    border: 1px solid ${colorPrimaryDefault};
  }
`;

AltButton.Icon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;
