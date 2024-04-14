import styled from "styled-components";

import { colorGrayscaleLabel, colorGrayscaleOffWhite } from "../../colors";

import { Link } from "react-router-dom";

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  font-weight: 500;
  font-size: 12px;
`;

export const MenuItem = styled(Link)`
  color: ${(props) =>
    props.active ? colorGrayscaleOffWhite : colorGrayscaleLabel};
  padding: 7.5px;
  text-decoration: none;
  :hover {
    color: ${(props) => (props.active ? colorGrayscaleOffWhite : "#fff")};
    cursor: ${(props) => (props.active ? "default" : "pointer")};
  }
`;

MenuItem.Disabled = styled.div`
  color: ${colorGrayscaleLabel};
  padding: 7.5px;
  opacity: 0.4;
  user-select: none;
`;
