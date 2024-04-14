import styled from "styled-components";
import Button from "@components/Button";
import {
  colorPrimaryDefault,
  colorGrayscaleLabel,
  colorGrayscaleOffWhite,
} from "@src/colors";

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InlineText = styled.span`
  font-size: ${(props) => props.size}px;
  color: ${(props) => props.color || colorGrayscaleLabel};
  text-transform: ${(props) => props.textTransform || "none"};
  &:hover {
    color: ${(props) => props.hoverColor || "none"};
  }
`;

export const Paragraph = styled.p`
  font-size: ${(props) => props.size}px;
  color: ${(props) => props.color || colorGrayscaleOffWhite};
  text-align: ${(props) => props.color || "center"};
`;

export const ActionButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export const ActionButton = styled(Button)`
  flex: 0.48;
  height: 60px;
  background: ${(props) => props.background || colorPrimaryDefault};
  color: ${(props) => props.color || colorPrimaryDefault};
  border: ${(props) =>
    props.outline ? `1px solid ${props.outline}` : undefined};
  border-radius: 10px;

  :disabled {
    color: ${(props) => (props.outline ? props.outline : colorPrimaryDefault)};
    background: none;
    cursor: default;
  }
`;
