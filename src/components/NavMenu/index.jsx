import React from "react";
import PropTypes from "prop-types";
import { useRouteMatch } from "react-router";

import { Root, MenuItem } from "./index.styles";
import { openInNewTab } from "@src/utils/navigation";

export default function NavMenu() {
  return (
    <Root>
      <NavLink path="/vaults" exact>
        Vaults
      </NavLink>
      <MenuItem.Disabled>Portfolio</MenuItem.Disabled>
      <NavLink path="/stake" exact>
        Stake
      </NavLink>
      <NavLink path="/farming" exact>
        Farming
      </NavLink>
      <MenuItem
        to="#"
        onClick={() =>
          openInNewTab("https://revault-network.gitbook.io/revault-network/")
        }
      >
        Learn
      </MenuItem>
    </Root>
  );
}

function NavLink({ path, exact, children }) {
  let match = useRouteMatch({
    path,
    exact,
  });

  return (
    <MenuItem to={path} active={match}>
      {children}
    </MenuItem>
  );
}

NavLink.propTypes = {
  path: PropTypes.string,
  exact: PropTypes.bool,
  children: PropTypes.node,
};
