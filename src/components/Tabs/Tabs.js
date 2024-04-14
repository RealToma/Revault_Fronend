import React from "react";
import { Tabs as ReactTabs } from "react-tabs";
import PropTypes from "prop-types";

import { TabList, Tab, TabPanel } from "./styles";

const Tabs = ({ tabs, panels, ...props }) => {
  return (
    <ReactTabs {...props}>
      <TabList>
        {tabs.map((tab) => (
          <Tab key={tab.title} disabled={tab.disabled}>
            {tab.title}
          </Tab>
        ))}
      </TabList>
      {panels.map((panel, index) => (
        <TabPanel key={index}>{panel}</TabPanel>
      ))}
    </ReactTabs>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.array,
  panels: PropTypes.array,
};

export default Tabs;
