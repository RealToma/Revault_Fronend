import React from "react";
import { useSelector } from "react-redux";

import { getTokenLink } from "../../helpers/utils";

import { Root, Stat, ExtrnalLink } from "./index.styles";

import Vector from "../../assets/svg/Vectory";
import NumberFormatter from "../NumberFormatter";

export default function Drawer() {
  const { data } = useSelector((state) => state.vaultsState);
  if (!data) {
    return null;
  }
  const { stats } = data;

  const getRevaStat = () => {
    return (
      <Stat>
        REVA
        <Stat.Value isPositive>
          <NumberFormatter value={stats?.reva?.value || 0} prefix="$" />
        </Stat.Value>
        <Stat.Graph>
          <Vector isBull />
        </Stat.Graph>
      </Stat>
    );
  };

  const getCurrentEmissionsStat = () => {
    return (
      <Stat>{`current emissions: ${stats.currEmissions || "0"}/block`}</Stat>
    );
  };

  const getMaxSupplyStat = () => {
    return (
      <Stat>
        <NumberFormatter
          value={stats.maxSupply || 0}
          prefix="Max supply: "
          suffix=" REVA"
        />
      </Stat>
    );
  };

  const getTotalSupplyStat = () => {
    return (
      <Stat>
        <NumberFormatter
          value={stats.totalSupply || 0}
          prefix="Total supply: "
          suffix=" REVA"
        />
      </Stat>
    );
  };

  const getTotalCirculatingSupplyStat = () => {
    return (
      <Stat>
        <NumberFormatter
          value={stats.circulatingSupply || 0}
          prefix="Circulating supply: "
          suffix=" REVA"
        />
      </Stat>
    );
  };

  return (
    <Root>
      {getRevaStat()}
      {getCurrentEmissionsStat()}
      {getMaxSupplyStat()}
      {getTotalSupplyStat()}
      {getTotalCirculatingSupplyStat()}
      <ExtrnalLink
        href={getTokenLink("reva")}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get Reva
      </ExtrnalLink>
    </Root>
  );
}
