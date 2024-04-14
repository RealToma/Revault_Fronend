import React from "react";

import { Redirect, Route } from "react-router-dom";

export default function Launcher() {
  return (
    <>
      <Route path="/" exact>
        <Redirect to="/vaults" />
      </Route>
    </>
  );
}
