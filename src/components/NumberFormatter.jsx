import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Big from "big.js";
import _ from "lodash";

import { abbreviateNumber, formatNumericString } from "../helpers/utils";
import ToolTip from "./ToolTip";

export default function NumberFormatter({
  value,
  prefix = "",
  suffix = "",
  format = true,
  precision = 3,
  withToolTip,
}) {
  let defaultDisplayValue = "0";
  if (precision > 0) {
    defaultDisplayValue += "." + "0".repeat(precision);
  }

  if (_.isString(value) && value.includes(",")) {
    value = value.replaceAll(",", "");
  }

  const displayValue = useMemo(
    () =>
      abbreviateNumber(value, format, precision, false, defaultDisplayValue),
    [value],
  );
  return withToolTip ? (
    <ToolTip
      text={`${prefix}${formatNumericString(
        new Big(value).toString(),
      )}${suffix}`}
    >
      <AbbreviatedValue
        displayValue={displayValue}
        prefix={prefix}
        suffix={suffix}
      />
    </ToolTip>
  ) : (
    <AbbreviatedValue
      displayValue={displayValue}
      prefix={prefix}
      suffix={suffix}
    />
  );
}

NumberFormatter.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Big),
  ]),
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  format: PropTypes.bool,
  precision: PropTypes.number,
  withToolTip: PropTypes.bool,
};

const AbbreviatedValue = ({ displayValue, prefix = "", suffix = "" }) => (
  <span
    style={{ whiteSpace: "nowrap" }}
  >{`${prefix}${displayValue}${suffix}`}</span>
);

AbbreviatedValue.propTypes = {
  displayValue: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
};
