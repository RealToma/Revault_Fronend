import styled from "styled-components";
import { colorGrayscaleLabel, colorGrayscaleLine } from "../../colors";

export const Root = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
  user-select: none;
`;

export const MetaMaskIcon = styled.img`
  display: flex;
  flex-direction: row;
  height: 24px;
  width: 24px;
  object-fit: contain;
  padding: 7px;
  border: 1px solid rgba(66, 75, 109, 0.5);
  border-radius: 5px;
`;

export const MetaMaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 143px;
  height: 38px;
  border: 1px solid rgba(66, 75, 109, 0.5);
  border-radius: 5px;
  margin-right: 5px;
  padding-left: 5px;
  padding-right: 5px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
`;

MetaMaskInfo.Chain = styled.div`
  color: ${colorGrayscaleLabel};
  line-height: 16px;
  text-transform: capitalize;
`;

MetaMaskInfo.Address = styled.div`
  width: 100%;
  color: ${colorGrayscaleLine};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 16px;
`;

export const PlusIcon = styled.img`
  width: 15px;
  height: 15px;
  object-fit: contain;
  margin-left: 9px;
`;
