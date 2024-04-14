import styled from "styled-components";
import CurrencyInput from "react-currency-input-field";

import {
  colorErrorDefault,
  colorGrayscaleBody,
  colorGrayscaleLabel,
  colorGrayscaleOffWhite,
  colorGrayscaleTitleActive,
  colorPrimaryDefault,
} from "../../colors";

export const Root = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 108px;
`;

export const FrameLeft = styled.div`
  border-radius: 10px 0px 0px 10px;
  width: 190px;
  background-color: ${colorGrayscaleTitleActive};
  padding-top: 10px;
  padding-left: 10px;
`;

FrameLeft.Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  color: ${colorGrayscaleLabel};
`;

FrameLeft.Title.Toggle = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  user-select: none;
  cursor: pointer;
  margin-right: 10px;

  :hover {
    opacity: 0.6;
  }
`;

FrameLeft.Details = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
`;

FrameLeft.Details.Text = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 6px;
`;

FrameLeft.Details.Text.Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: ${colorGrayscaleOffWhite};
`;

FrameLeft.Details.Text.Subtitle = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${colorGrayscaleLabel};
`;

export const FrameRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-radius: 0px 10px 10px 0px;
  flex: 1;
  width: 240px;
  background-color: #171a30;
  padding-right: 10px;
  padding-top: 12px;
`;

FrameRight.TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 20px;
  margin-bottom: 13px;
  width: 100%;
`;

FrameRight.Title = styled.div`
  margin-left: 10px;
`;

FrameRight.Balance = styled.div`
  font-weight: 600;
  font-size: 12px;
  color: ${colorGrayscaleLabel};
  cursor: pointer;
`;

FrameRight.Balance.Max = styled.div`
  color: ${colorPrimaryDefault};
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  user-select: none;
  cursor: pointer;

  :hover {
    opacity: 0.5;
  }
`;

FrameRight.FiatSum = styled.div`
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  width: 220px;
  overflow: hidden;
  padding-left: 10px;
  text-align: right;
  color: ${(props) =>
    props.$overLimit ? colorErrorDefault : colorGrayscaleLabel};
`;

FrameRight.PrecentageButtons = styled.div`
  display: flex;
`;

FrameRight.PrecentageButton = styled.button`
  background: transparent;
  color: ${(props) =>
    props.active ? colorPrimaryDefault : colorGrayscaleLabel};
  border: none;
  cursor: pointer;
  padding: 0 0 0 0.5rem;
  font-weight: 600;
  font-size: 12px;
`;

FrameRight.TokenSum = styled(CurrencyInput)`
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 32px;
  color: ${(props) => {
    return props.$overLimit
      ? colorErrorDefault
      : props.value > 0
      ? colorGrayscaleOffWhite
      : colorGrayscaleBody;
  }};
  background-color: transparent;
  text-align: end;
  border: none;
  outline: none;
  ::placeholder {
    font-weight: normal;
    font-size: 20px;
    line-height: 32px;
    color: ${colorGrayscaleBody};
  }
`;

export const StyledLink = styled.a`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${colorGrayscaleLabel};
  text-decoration: none;
  &:hover {
    color: white;
  }
`;

StyledLink.Icon = styled.img`
  width: 13px;
  height: 13px;
  object-fit: contain;
  margin-left: 5px;
`;
