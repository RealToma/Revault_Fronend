/**
 * Couldn't make GA to work with this hook, instead we pushed GA in index.html file
 * In order for this to work we need to follow this: https://stackoverflow.com/questions/62135901/reactga-not-working-for-g-type-tracking-id
 */

import { useHistory, useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { useEffect } from "react";
import { GA_TRACKING_ID } from "../constants";

function trackPage(location) {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
}

function useGoogleAnalytics() {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize(GA_TRACKING_ID);
    trackPage(location);
  }, []);

  history.listen((location) => {
    trackPage(location);
  });
}

export default useGoogleAnalytics;
