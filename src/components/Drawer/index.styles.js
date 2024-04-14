import styled from "styled-components";

import {
  colorErrorDefault,
  colorGrayscalePlaceholder,
  colorSuccessDarkmode,
  colorPrimaryDefault,
} from "../../colors";

export const Root = styled.div`
  display: flex;
  height: 44px;
  width: 100%;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-transform: uppercase;
  color: ${colorGrayscalePlaceholder};
  align-items: center;
  justify-content: space-between;
`;

export const Stat = styled.div`
  display: flex;
  align-items: center;
`;

Stat.Value = styled.div`
  margin-left: 5px;
  color: ${(props) =>
    props.isPositive ? colorSuccessDarkmode : colorErrorDefault};
`;

Stat.Graph = styled.div`
  margin-left: 5px;
  margin-bottom: 3px;
`;

export const ExtrnalLink = styled.a`
  padding: 5px 10px;
  background: rgba(146, 47, 224, 0.1);
  border-radius: 35px;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  color: ${colorPrimaryDefault};
  user-select: none;
  cursor: pointer;
  text-decoration: none;

  :hover {
    opacity: 0.6;
  }
`;
