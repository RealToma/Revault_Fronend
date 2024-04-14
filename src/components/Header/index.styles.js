import styled from "styled-components";
import { colorGrayscaleBody } from "../../colors";

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1024px;
  height: 40px;
  margin-top: 25px;
`;

export const LogoContainer = styled.div`
  display: flex;
`;

export const ExternalLink = styled.a`
  text-decoration: none;
`;

export const VersionLabel = styled.div`
  color: ${colorGrayscaleBody};
  padding-top: 29px;
  padding-left: 10px;
  font-size: 14px;
`;
