import styled from "styled-components";

import {
  colorErrorDefault,
  colorGrayscaleLabel,
  colorGrayscaleOffWhite,
  colorGrayscaleTitleActive,
  colorPrimaryDark,
  colorErrorDark,
  colorPrimaryDefault,
} from "../../colors";

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  height: 35px;
  color: ${colorGrayscaleOffWhite};
  margin-bottom: 5px;
`;

Title.Icon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  margin-left: 5px;
  margin-bottom: 2px;
`;

export const Stats = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 57px;
  margin-bottom: 24px;
`;

Stats.Icon = styled.img`
  width: 24px;
  height: 24px;
  margin: 0px 22px;
  object-fit: contain;
`;

Stats.Item = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  color: ${colorGrayscaleLabel};
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-transform: uppercase;
`;

Stats.Item.Value = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 26px;
  font-weight: normal;
  line-height: 39px;
  color: ${colorGrayscaleOffWhite};
`;

export const BarPrefix = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
`;

export const BarSuffix = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  color: ${(props) =>
    props.isRebalanceRequired ? colorErrorDefault : colorGrayscaleOffWhite};
`;

BarSuffix.Bkg = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 30px;
  border-radius: 0px 5px 5px 0px;
  margin-left: -15px;
  padding-left: 20px;
  padding-right: 10px;
  color: ${(props) =>
    props.isRebalanceRequired ? colorErrorDefault : colorPrimaryDefault};
  background-color: ${(props) =>
    props.isRebalanceRequired
      ? "rgba(237, 46, 126, 0.3)"
      : colorGrayscaleTitleActive};
`;

export const BarSign = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-left: 6px;
  color: ${colorGrayscaleOffWhite};
  background-color: ${(props) =>
    props.isRebalanceRequired ? colorErrorDark : colorPrimaryDark};
  font-weight: 500;
  font-size: 12px;
  z-index: 1;
`;

export const Notice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${colorErrorDefault};
`;
