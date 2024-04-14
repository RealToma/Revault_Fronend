import styled from "styled-components";
import {
  colorGrayscaleBody,
  colorGrayscaleDark,
  colorGrayscaleLabel,
  colorGrayscaleOffWhite,
  colorGrayscalePlaceholder,
  colorSuccessDefault,
} from "../../colors";

import Button from "../Button";

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 340px;
  height: 400px;
  background-color: ${colorGrayscaleDark};
  border-radius: 20px;
  border: 1px solid #00ba88;
  padding-top: 20px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: -10px;
  font-weight: bold;
  font-size: 22px;
  line-height: 32px;
  height: 38px;
  color: ${colorGrayscaleOffWhite};
`;

Title.Close = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
  user-select: none;
  cursor: pointer;

  :hover {
    opacity: 0.6;
  }
`;

export const Subtitle = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${colorGrayscaleLabel};
`;

export const Header = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${colorGrayscaleBody};
  margin-bottom: 10px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${colorGrayscalePlaceholder};
  margin-bottom: 3px;
`;

Row.Item = styled.div``;

Row.MainItem = styled.div`
  font-weight: 1000;
  color: ${colorGrayscaleOffWhite};
`;

export const ActionButton = styled(Button)`
  height: 60px;
  color: ${colorGrayscaleOffWhite};
  background-color: ${colorSuccessDefault};
  margin-top: 13px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 26px;

  :hover {
    background-color: ${colorSuccessDefault};
    opacity: 0.6;
  }
`;
