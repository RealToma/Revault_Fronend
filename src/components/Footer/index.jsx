import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { colorGrayscaleDark, colorGrayscalePlaceholder } from "../../colors";
import Drawer from "../Drawer";
import InfoItem from "../InfoItem/InfoItem";
import PropTypes from "prop-types";
import Logo from "../Logo";
import { StyledLink } from "../AssetView/index.styles";
import { Title } from "../PositionSidePane/ControlPanel.styles";
import iconChevronUp from "../../assets/chevron-up-white.png";
import iconChevronDown from "../../assets/chevron-down-white.svg";
import { animated, useSpring } from "@react-spring/web";
import { easeExpOut } from "d3-ease";

const FOOTER_NAVIGATION = [
  {
    title: "Discover",
    links: [
      { name: "about us", href: "https://www.revault.network/about" },
      { name: "medium", href: "https://revaultnetwork.medium.com/" },
      { name: "media kit", href: "https://www.revault.network/press" },
      {
        name: "contracts",
        href: "https://revault-network.gitbook.io/revault-network/protocol/smart-contracts",
      },
    ],
  },
  {
    title: "community",
    links: [
      { name: "twitter", href: "https://twitter.com/revaultnetwork" },
      { name: "discord", href: "https://discord.com/invite/revaultnetwork" },
      { name: "telegram", href: "https://t.me/revaultnetwork" },
    ],
  },
  // {
  //   title: "legal",
  //   links: [
  //     { name: "terms of service", href: undefined },
  //     { name: "cookies", href: undefined },
  //     { name: "privacy policy", href: undefined },
  //   ],
  // },
  {
    title: "contact",
    links: [
      {
        name: "team@revault.network",
        href: "mailto:team@revault.network",
      },
    ],
  },
];

export default function Footer() {
  const vaultsState = useSelector((state) => state.vaultsState);
  const [showExpandedFooter, setShowExpandedFooter] = useState(false);

  const expandAnimationProps = useSpring({
    height: showExpandedFooter ? 254 : 130,
    config: { duration: 800, easing: easeExpOut },
  });

  if (!vaultsState.data) return null;

  return (
    <MainContainer
      css={showExpandedFooter ? "height: 254px;" : null}
      onClick={() => setShowExpandedFooter((prev) => !prev)}
    >
      <animated.div className="container" style={expandAnimationProps}>
        <FlexContainer css=" align-items: center; width: 100%;">
          <Drawer data={vaultsState.data} />
          <Title.Close
            src={showExpandedFooter ? iconChevronDown : iconChevronUp}
          />
        </FlexContainer>
        {showExpandedFooter ? <ExpandedFooter /> : null}
      </animated.div>
    </MainContainer>
  );
}

const subtitleStyle = "text-transform: capitalize ; font-size: 14px; ";

export const ExpandedFooter = () => {
  const data = [
    {
      title: <Logo width={100} height={"auto"} />,
      body: (
        <div>
          {" "}
          <p>© 2021 Revault Ltd. All rights reserved</p>{" "}
        </div>
      ),
      css: "flex: 0.5; text-align: start;",
    },
    ...FOOTER_NAVIGATION.map(({ title, links }) => ({
      title,
      body: <ListOfLinks list={links} />,
    })),
  ];

  return (
    <FlexContainer css="padding: 20px 20px 0 0;">
      {data.map(({ title, body, css }) => (
        <InfoItem
          style={css}
          textAlign="start"
          key={title}
          title={title}
          subtitle={body}
          titleStyle="text-transform: capitalize; font-size: 16px; text-align: start;"
          subtitleStyle={subtitleStyle}
        />
      ))}
    </FlexContainer>
  );
};

const ListOfLinks = ({ list }) => {
  return (
    <ListOfLinksContainer>
      {list.map(
        ({ name, href }) =>
          href && (
            <StyledLink
              key={name}
              href={href}
              css={subtitleStyle + "font-weight: normal;"}
            >
              {name}
            </StyledLink>
          ),
      )}
    </ListOfLinksContainer>
  );
};

ListOfLinks.propTypes = {
  list: PropTypes.array,
};

const MainContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0%);
  height: 44px;
  width: 100%;
  max-width: 1164px;
  border-top-right-radius: 22px;
  border-top-left-radius: 22px;
  background-color: ${colorGrayscaleDark};
  padding-left: 86px;
  padding-right: 8px;
  z-index: 99;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${colorGrayscalePlaceholder};
  justify-content: space-around;
`;

const ListOfLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 25px;
  justify-content: space-between;
`;
