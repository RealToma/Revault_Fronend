import styled from "styled-components";
import {
  colorGrayscaleBody,
  colorGrayscaleDark,
  colorGrayscaleLabel,
  colorGrayscaleOffWhite,
  colorGrayscaleTitleActive,
} from "../../colors";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 420px;
  max-height: 720px;
  margin-top: 80px;
  margin-bottom: 110px;
  background-color: ${colorGrayscaleTitleActive};
  border-radius: 20px;
  padding: 25px;
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 32px;
  color: ${colorGrayscaleOffWhite};
`;

export const InputContainer = styled.div`
  display: flex;
  position: relative;
  height: 40px;
  margin-top: 15px;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  width: 100%;
  background-color: ${colorGrayscaleDark};
  border-radius: 5px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 8px;
  padding-left: 38px;
  height: 24px;
  border: none;
  outline: none;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.25px;
  color: ${colorGrayscaleBody};
`;

Input.Icon = styled.img`
  position: absolute;
  left: 8px;
  top: 8px;
  height: 24px;
  width: 24px;
  object-fit: contain;
`;

export const Slider = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
  font-size: 12px;
  color: ${colorGrayscaleLabel};
  overflow-y: auto;
`;
