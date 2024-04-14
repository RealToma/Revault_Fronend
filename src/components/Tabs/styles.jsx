import styled from "styled-components";
import {
  Tab as RTTab,
  TabList as RTTabList,
  TabPanel as RTTabPanel,
} from "react-tabs";
import {
  colorGrayscaleOffWhite,
  colorPrimaryDark,
  colorGrayscaleBody,
  colorGrayscaleTitleActive,
} from "../../colors";

export const TabList = styled(RTTabList)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  list-style: none;
  gap: 1.875rem;
  padding: 0;
  border-bottom: 1px solid ${colorGrayscaleTitleActive};
`;

export const Tab = styled(RTTab)`
  cursor: pointer;
  color: ${colorGrayscaleBody};
  font-size: 1.25rem;
  line-height: 2.1875rem;
  padding: 0 0 0.625rem 0;
  min-width: 6.25rem;
  text-align: center;

  &.react-tabs__tab--selected {
    color: ${colorGrayscaleOffWhite};
    border-bottom: 0.1875rem solid ${colorPrimaryDark};
  }
  &.react-tabs__tab--disabled {
    color: #424b6d;
  }
`;

export const TabPanel = styled(RTTabPanel)`
  display: flex;
  width: 27.5rem;
  flex-direction: column;
  margin: 0 auto;

  #button-wrapper {
    display: flex;
    flex-direction: row;
    gap: 0.625rem;
  }
`;
