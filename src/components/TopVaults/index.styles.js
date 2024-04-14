import styled from "styled-components";
import Button from "../Button";

import {
  colorErrorDefault,
  colorGrayscaleLine,
  colorGrayscaleOffWhite,
  colorGrayscalePlaceholder,
  colorPrimaryDefault,
  colorSuccessDarkmode,
} from "../../colors";

const colorBarDefault = "rgba(66, 75, 109, 0.4)";

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: ${(props) => (props.isCompact ? "normal" : "bold")};
  font-size: ${(props) => (props.isCompact ? "12" : "20")}px;
  line-height: ${(props) => (props.isCompact ? "18" : "35")}px;
  color: ${colorGrayscaleOffWhite};
`;

Title.AllVaults = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: ${colorPrimaryDefault};
  user-select: none;
  cursor: pointer;

  :hover {
    opacity: 0.6;
  }
`;

export const Stat = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: ${(props) => (props.isCompact ? "6" : "10")}px;
  width: 100%;
  height: ${(props) => (props.isCompact ? "20" : "34")}px;
  font-size: 12px;

  :hover {
    opacity: 0.6;
  }
`;

Stat.Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: ${(props) => (props.fullWidth ? "100%" : "calc(100% - 100px)")};
  font-weight: 500;
  align-items: center;
  text-transform: uppercase;
`;

Stat.Container.Bar = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: ${(props) => props.percent}%;
  background: ${(props) => {
    if (props.vaultsHavePosition) {
      if (props.vaultsHaveBestPosition) {
        // rebalance won't be required
        return props.inPosition ? "rgba(255, 255, 255, 0.2)" : colorBarDefault;
      } else if (props.isFirst) {
        // rebalance required, this is the top vault
        return "rgba(0, 186, 136, 0.3)";
      } else {
        // rebalance required, this might be a vault we're in position in or not
        return props.inPosition ? "rgba(237, 46, 126, 0.3)" : colorBarDefault;
      }
    } else {
      return props.isFirst ? "rgba(0, 186, 136, 0.3)" : colorBarDefault;
    }
  }};
  border-radius: 5px;
  border: 1px solid
    ${(props) => {
      if (props.vaultsHavePosition) {
        if (props.vaultsHaveBestPosition) {
          // rebalance won't be required
          return props.inPosition ? colorGrayscaleOffWhite : colorBarDefault;
        } else if (props.isFirst) {
          // rebalance required, this is the top vault
          return colorSuccessDarkmode;
        } else {
          // rebalance required, this might be a vault we're in position in or not
          return props.inPosition ? colorErrorDefault : colorBarDefault;
        }
      } else {
        return props.isFirst ? colorSuccessDarkmode : colorBarDefault;
      }
    }};
  height: ${(props) => (props.isCompact ? "25" : "30")}px;
`;

Stat.Container.Bar.Logo = styled.img`
  position: absolute;
  width: 25px;
  height: 25px;
  object-fit: contain;
  margin-bottom: 2px;
  margin-left: 2px;
  margin-right: 2px;
`;

Stat.Container.Bar.CompactLogo = styled.img`
  width: 35px;
  height: 35px;
  object-fit: contain;
  margin-bottom: 2px;
  margin-left: -3px;
  margin-right: 5px;
`;

Stat.Container.Bar.Text = styled.div`
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  padding-left: ${(props) => (props.isCompact ? "unset" : "29px")};
  text-overflow: ellipsis;
  color: ${colorGrayscaleLine};
`;

Stat.Container.APY = styled(Stat.Container.Bar.Text)`
  color: ${(props) =>
    props.isFirst ? colorGrayscaleOffWhite : colorGrayscalePlaceholder};
  padding-left: 10px;
  padding-right: ${(props) => (props.isCompact ? "4" : "10")}px;
`;

Stat.Control = styled.div`
  width: 95px;
  margin-left: 10px;
`;

Stat.Rebalance = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 95px;
  height: 36px;
  margin-left: 14px;
  border-radius: 5px;
  border: 2px solid #096758;
  box-shadow: 0px 4px 14px rgba(0, 186, 136, 0.3);
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.25px;
`;
