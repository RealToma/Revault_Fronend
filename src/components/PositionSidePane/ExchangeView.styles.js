import styled from "styled-components";
import {
  colorGrayscaleBody,
  colorGrayscaleDark,
  colorGrayscaleLabel,
  colorGrayscalePlaceholder,
  colorPrimaryDefault,
} from "../../colors";

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 75px;
`;

export const ActionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${colorGrayscaleBody};
  border-radius: 10px;
  color: ${colorPrimaryDefault};
  font-weight: 600;
  font-size: 14px;
  height: 60px;
  margin-top: 15px;
  user-select: none;
  cursor: pointer;

  :hover {
    background-color: ${colorGrayscaleDark};
    opacity: 0.6;
  }
`;

export const Arrow = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 23px;
`;

export const Notice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  margin-top: 10px;
  color: ${colorGrayscaleLabel};
`;

export const Rate = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: ${colorGrayscalePlaceholder};
`;

Rate.Title = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${colorGrayscaleLabel};
  text-transform: uppercase;
`;
