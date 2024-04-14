import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ContentLoader from "react-content-loader";

import { colorGrayscaleOffWhite, colorGrayscaleLabel } from "../../colors";

export default function InfoItem({
  title,
  subtitle,
  loading = false,
  titleStyle,
  subtitleStyle,
  style,
}) {
  if (loading) {
    return <Loader />;
  } else {
    return (
      <Item css={style}>
        <Title css={titleStyle}>{title}</Title>
        <Subtitle css={subtitleStyle}>{subtitle}</Subtitle>
      </Item>
    );
  }
}

InfoItem.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  subtitle: PropTypes.string,
  style: PropTypes.string,
  titleStyle: PropTypes.string,
  subtitleStyle: PropTypes.string,
  loading: PropTypes.bool,
};

/** Loaders */

export const Loader = (props) => (
  <ContentLoader
    speed={2}
    width={250}
    height={150}
    viewBox="0 0 250 150"
    backgroundColor="rgba(38, 43, 69, 0.4)"
    foregroundColor="rgba(255, 255, 255, 0.1)"
    {...props}
  >
    <rect x="0" y="68" rx="0" ry="0" width="138" height="18" />
    <rect x="0" y="0" rx="0" ry="0" width="250" height="62" />
  </ContentLoader>
);

/** Styled Components */

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 0;
`;

const Title = styled.span`
  font-size: 1.625rem;
  line-height: 2.4375rem;
  margin: 0
  text-transform: capitalize;
  color: ${colorGrayscaleOffWhite};
`;

export const Subtitle = styled.span`
  color: ${colorGrayscaleLabel};
  font-size: 0.75rem;
  line-height: 1.125rem;
  text-transform: uppercase;
  margin: 0;
  font-weight: normal;
`;
