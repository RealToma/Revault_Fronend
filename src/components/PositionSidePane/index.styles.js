import styled from "styled-components";

import {
  colorGrayscaleTitleActive,
  colorPrimaryDefault,
  colorGrayscaleOffWhite,
  colorGrayscaleLabel,
} from "../../colors";

const sidePaneWidth = 500;

export const Root = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: row-reverse;
  background-color: rgba(0, 0, 0, 0.7);

  z-index: 200;
  animation: fadein 0.08s linear forwards;

  @keyframes fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const SidePane = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: ${`${sidePaneWidth}px`};
  background-color: ${colorGrayscaleTitleActive};
  border-left: 2px solid ${colorPrimaryDefault};

  animation: slidein 0.15s ease-out forwards;

  @keyframes slidein {
    0% {
      margin-right: ${`-${sidePaneWidth}px`};
    }
    100% {
      margin-right: 0px;
    }
  }
`;

export const Scrollable = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 190px;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: ${colorGrayscaleOffWhite};
  font-weight: bold;
  font-size: 32px;
  line-height: 40px;
  text-transform: uppercase;
  padding-top: 26px;
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 40px;
`;

Title.Prefix = styled.div`
  display: flex;
  flex-direction: column;
`;

Title.Prefix.TVL = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${colorGrayscaleLabel};
`;
