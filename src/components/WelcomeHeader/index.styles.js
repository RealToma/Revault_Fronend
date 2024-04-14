import styled from "styled-components";

import Button from "../Button";

import {
  colorGrayscaleOffWhite,
  colorGrayscaleLabel,
  colorPrimaryDefault,
} from "../../colors";

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 28px;
`;

export const Title = styled.div`
  color: ${colorGrayscaleOffWhite};
  font-weight: bold;
  font-size: 32px;
  line-height: 40px;
`;
export const Subtitle = styled.div`
  color: ${colorGrayscaleLabel};
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
`;

export const PlayIcon = styled.img`
  width: 17px;
  height: 17px;
  object-fit: contain;
  margin-right: 7px;
`;

export const PlayButton = styled(Button)`
  background-color: rgba(146, 47, 224, 0.1);
  color: ${colorPrimaryDefault};
  margin-top: 20px;
  margin-bottom: 30px;

  :hover {
    background-color: rgba(146, 47, 224, 0.3);
  }
`;
