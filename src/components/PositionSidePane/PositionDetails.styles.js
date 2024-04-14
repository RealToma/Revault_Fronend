import styled from "styled-components";
import {
  colorGrayscaleBody,
  colorGrayscaleDark,
  colorGrayscaleLabel,
  colorGrayscaleOffWhite,
  colorPrimaryDefault,
} from "../../colors";

import Button from "../Button";

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Stats = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;

Stats.Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

Stats.Item = styled.div`
  display: flex;
  flex-direction: column;
`;

Stats.Item.Title = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-transform: uppercase;
  color: ${colorPrimaryDefault};
`;

Stats.Item.Value = styled.div`
  font-weight: bold;
  font-size: ${(props) => props.size || 22}px;
  line-height: 32px;
  color: ${colorGrayscaleOffWhite};
`;

Stats.Item.Subtitle = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-transform: uppercase;
  color: ${colorGrayscaleLabel};
`;

Stats.Item.Divider = styled.div`
  width: 2px;
  height: 100%;
  opacity: 0.3;
  background-color: ${colorGrayscaleBody};
`;

Stats.Item.Gap = styled.div`
  height: 10px;
`;

export const ClaimButton = styled(Button)`
  flex: 1;
  position: relative;
  height: 60px;
  color: ${colorPrimaryDefault};
  background-color: transparent;
  border: 1px solid ${colorGrayscaleBody};
  font-weight: 600;
  font-size: 14px;
  line-height: 26px;

  :hover {
    background-color: ${colorGrayscaleDark};
    opacity: 0.6;
  }
`;
