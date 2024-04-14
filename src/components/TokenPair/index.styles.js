import styled from "styled-components";

import {
  colorPrimaryDefault,
  colorGrayscaleLabel,
  colorGrayscaleTitleActive,
  colorGrayscaleBody,
  colorGrayscaleOffWhite,
  colorGrayscaleLine,
} from "../../colors";

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

export const Background = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${(props) =>
    props.hovered
      ? "linear-gradient(180deg, #14162b 0%, #110040 100%)"
      : "unset"};
  background-color: ${(props) =>
    props.hovered ? "transparent" : colorGrayscaleTitleActive};
  border: 2px solid
    ${(props) => (props.hovered ? colorPrimaryDefault : "transparent")};
  border-radius: 10px;
  z-index: 1;

  :hover {
    background-color: unset;
    background: linear-gradient(180deg, #14162b 0%, #110040 100%);
    border: 2px solid #5f2eea;
  }
`;

export const Content = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 15px;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: ${colorGrayscaleOffWhite};
  width: 100%;
  height: 32px;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 18px;
`;

Title.HR = styled.hr`
  border: 0.1px solid #1c2137;
  width: calc(100% + 25px);
  margin-left: -12.5px;
  margin-bottom: 5px;
`;

export const ApyInfo = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

ApyInfo.Plus = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  object-fit: contain;
  left: 50%;
  margin-left: -12px;
  top: 50%;
  margin-top: -10px;
  opacity: 0.8;
`;

ApyInfo.Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
`;

ApyInfo.Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

export const Text = styled.div`
  color: ${colorGrayscaleBody};
  font-weight: 500;
  text-transform: uppercase;
`;

Text.M = styled(Text)`
  font-size: 12px;
  line-height: 18px;
`;

Text.S = styled(Text)`
  font-size: 9px;
`;

export const Value = styled.div`
  font-weight: normal;
`;

Value.L = styled(Value)`
  font-size: 24px;
  color: ${colorGrayscaleOffWhite};
  line-height: 38px;
`;

Value.M = styled(Value)`
  color: ${colorGrayscaleLabel};
  font-weight: 500;
  font-size: 16px;
`;

Value.S = styled(Value)`
  font-weight: 500;
  font-size: 9px;
  color: ${colorGrayscaleBody};
`;

export const Optimization = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  height: 96px;
`;

export const Position = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.inPosition ? "column" : "row")};
  height: 56px;
  align-items: center;
  justify-content: ${(props) => (props.inPosition ? "unset" : "space-between")};
`;

Position.Left = styled.div``;

Position.Enter = styled.div`
  color: ${colorPrimaryDefault};
  font-weight: 600;
  font-size: 12px;
  padding: 10px;
  margin-top: 5px;
  user-select: none;
  cursor: pointer;

  :hover {
    opacity: 0.5;
  }
`;

Position.Detail = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-transform: uppercase;
  color: ${colorGrayscaleBody};
`;

export const PlusHover = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: -8px;
  display: flex;
  height: 26px;
  justify-content: center;
  align-items: center;
`;

PlusHover.Content = styled.div`
  display: inline-block;
  border-radius: 60px;
  color: ${colorGrayscaleLine};
  font-size: 12px;
  padding: 3px 10px;
  background-color: ${colorGrayscaleBody};
`;
