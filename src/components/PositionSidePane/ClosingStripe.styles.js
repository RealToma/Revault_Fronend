import styled from "styled-components";
import { colorGrayscaleBody } from "../../colors";

export const Root = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  margin-top: 15px;
`;

export const Chevron = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  margin-left: 10px;
  margin-right: 10px;
`;

export const Stripe = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${colorGrayscaleBody};
`;
