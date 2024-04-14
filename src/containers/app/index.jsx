import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import PropTypes from "prop-types";
import { useMetamask } from "use-metamask";
import { Route } from "react-router-dom";
import Big from "big.js";
import Launcher from "../launcher";
import About from "../about";
import Vaults from "../vaults";
import Stake from "../stake";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { web3Connect } from "../../components/ModalConnect/MetaMaskConnect";
import { GA_TRACKING_ID, web3SessionKey } from "../../constants";
import { Root, Background, Circle } from "./index.styles";
import circleBlur from "../../assets/bkg-blur.png";
import FarmingScreen from "../farming";
import Footer from "../../components/Footer";
import MobileView from "../mobile";
import { isMobileOnly } from "react-device-detect";
import Logo from "../../components/Logo";
import { ReactComponent as RefreshIcon } from "@assets/icons/refresh.svg";
import { Title, Subtitle } from "@components/Text";
import { ActionButton, ActionButtons } from "../common/styles";
import { colorGrayscaleOffWhite } from "../../colors";

Big.NE = -100;
Big.PE = 100;

export default function App() {
  const { connect, metaState } = useMetamask();
  const [continueWithDesktop, setContinueWithDesktop] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem(web3SessionKey) === "true" &&
      metaState.isAvailable &&
      !metaState.isConnected
    ) {
      (async () => {
        await web3Connect(connect);
      })();
    }
  }, [metaState.isAvailable]);

  return (
    <Root>
      <Background>
        <Circle src={circleBlur} />
      </Background>
      <main>
        <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
          {isMobileOnly && !continueWithDesktop ? (
            <MobileView
              onDesktopVersion={() => {
                setContinueWithDesktop(true);
              }}
            />
          ) : (
            <>
              <ToastContainer />
              <Route exact path="/" component={Launcher} />
              <Route exact path="/vaults" component={Vaults} />
              <Route exact path="/stake" component={Stake} />
              <Route exact path="/farming" component={FarmingScreen} />
              <Route exact path="/about" component={About} />
            </>
          )}
          <Footer />
        </ErrorBoundary>
      </main>
    </Root>
  );
}

// eslint-disable-next-line no-unused-vars
function FullPageErrorFallback({ error }) {
  return (
    <div
      style={{
        position: "relative",
        width: "400px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "auto",
      }}
    >
      <Logo />

      <div css="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px; margin-top: 18vh">
        <RefreshIcon
          width="104"
          height="85"
          style={{ color: "#5F2EEA", marginBottom: 20 }}
        />
        <Title>
          Oops! There seems to be a problem.
          <br /> please try again.
        </Title>

        <Subtitle css="text-align: center;">
          Please try to refresh the app, if the problem persists please
          <span css="color: #5F2EEA;">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:test"
              css={`
                color: #5f2eea;
                text-decoration: none;
                :hover {
                  color: ${colorGrayscaleOffWhite};
                }
              `}
            >
              {" "}
              contact us
            </a>
          </span>
        </Subtitle>
        <ActionButtons>
          <ActionButton
            text="Refresh App"
            color={colorGrayscaleOffWhite}
            onClick={() => window.location.reload()}
            css="margin: auto;"
          />
        </ActionButtons>
      </div>
    </div>
  );
}

FullPageErrorFallback.propTypes = {
  error: PropTypes.object,
};
