import { css } from "styled-components";

export const textHoverStyle = css`
  &:hover {
    color: ${(props) => props.color || "#fff"};
  }
`;
