import styled from "styled-components";
import {
  colorGrayscaleDark,
  colorGrayscaleLabel,
  colorGrayscaleOffWhite,
  colorGrayscaleTitleActive,
} from "../../colors";

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  width: 419px;
  background-color: ${colorGrayscaleDark};
  border-radius: 20px;
  user-select: none;
`;

Content.Title = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 32px;
  color: ${colorGrayscaleOffWhite};
`;

Content.Subtitle = styled.div`
  font-size: 14px;
  line-height: 24px;
  color: ${colorGrayscaleLabel};
  margin-bottom: 45px;
`;

Content.BrandName = styled.div`
  color: ${colorGrayscaleOffWhite};
  margin-top: 16px;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
`;

Content.Frame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 140px;
  height: 140px;
  background-color: ${colorGrayscaleTitleActive};
  border-radius: 10px;
  user-select: none;
  cursor: pointer;
`;

Content.Icon = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;
