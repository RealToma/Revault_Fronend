import React, { useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import { useOnClickOutside } from "../../helpers/hooks";

import {
  Wrapper,
  Root,
  Title,
  InputContainer,
  Input,
  Slider,
} from "./index.styles";

import iconSearch from "../../assets/icon-search.png";
import TokenCard from "./TokenCard";

export default function TokenSelect({
  data = [],
  sourceTokenId,
  onTokenSelected,
  onClose,
}) {
  const ref = useRef();
  useOnClickOutside(ref, onClose);

  const allItems = useMemo(() => {
    return data.filter((token) => token.tokenId !== sourceTokenId);
  }, [data, sourceTokenId]);

  const [displayItems, setDisplayItems] = useState(allItems);

  const handleInputChange = (e) => {
    setDisplayItems(filterItems(allItems, e.target.value.trim()));
  };

  return (
    <Wrapper>
      <Root ref={ref}>
        <Title>Select Token</Title>
        <InputContainer>
          <Input onChange={handleInputChange} placeholder="Search..." />
          <Input.Icon src={iconSearch} />
        </InputContainer>
        <Slider>
          {displayItems.length === 0
            ? "No results..."
            : displayItems.map((t, index) => (
                <TokenCard
                  key={`tc-${index}`}
                  data={t}
                  onClick={onTokenSelected}
                />
              ))}
        </Slider>
      </Root>
    </Wrapper>
  );
}

function filterItems(items, searchTerm) {
  if (!_.isEmpty(searchTerm)) {
    return items.filter((t) => t.tokenDetails.symbol.includes(searchTerm));
  }
  return items;
}

TokenSelect.propTypes = {
  data: PropTypes.array,
  sourceTokenId: PropTypes.number,
  onTokenSelected: PropTypes.func,
  onClose: PropTypes.func,
};
