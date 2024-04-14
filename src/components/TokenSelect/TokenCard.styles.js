import styled from "styled-components";
import {
  colorGrayscaleDark,
  colorGrayscaleLabel,
  colorGrayscaleOffWhite,
} from "../../colors";

export const Root = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 7.5px;
  margin-bottom: 7.5px;
  user-select: none;
  cursor: pointer;

  :hover {
    background: rgba(14, 17, 33, 0.7);
    border-radius: 10px;
    opacity: 0.8;
  }
`;

export const TokenIcon = styled.img`
  width: 47px;
  height: 47px;
  padding: 11px;
  border-radius: 10px;
  background-color: ${colorGrayscaleDark};
  margin-right: 10px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding-right: 10px;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: ${colorGrayscaleOffWhite};
  text-transform: uppercase;
  width: 100%;
`;

export const Subtitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${colorGrayscaleLabel};
  width: 100%;
`;
