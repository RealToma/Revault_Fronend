import React from "react";
import { render } from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Web3ReactProvider } from "@web3-react/core";
import store, { history } from "./store";
import App from "./containers/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { getLibrary } from "./utils/connectors";

const queryClient = new QueryClient();

const target = document.querySelector("#root");

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </Web3ReactProvider>
    </ConnectedRouter>
  </Provider>,
  target,
);
