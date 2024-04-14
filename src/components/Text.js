import styled from "styled-components";
import { colorGrayscaleLabel, colorGrayscaleOffWhite } from "../colors";

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  color: ${colorGrayscaleOffWhite};
  width: 100%;
  height: 47px;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 18px;
`;

export const Subtitle = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${colorGrayscaleLabel};
`;

export const StyledLink = styled.a`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-decoration: none;
  &:hover {
    color: white;
  }
`;
