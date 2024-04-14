import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { fees } from "../../sagas/vaults";
import styled from "styled-components";
import { colorGrayscaleBody, colorGrayscalePlaceholder } from "../../colors";
import { QUERY_KEYS } from "../../constants";

function VaultFees({ vaultId }) {
  const {
    data: feesData,
    refetch: fetchFees,
    isFetching,
  } = useQuery(
    QUERY_KEYS.vaultFees,
    () => {
      if (!vaultId) {
        return;
      }
      return fees({ vaultId });
    },
    { refetchOnWindowFocus: false },
  );

  useEffect(() => {
    fetchFees();
  }, [vaultId]);

  return (
    <Fees>
      {!isFetching && feesData && (
        <>
          <Fees.Title>Fees:</Fees.Title>
          <Fees.Row>
            <Fees.Value>Platform fee:</Fees.Value>
            <Fees.Value>1% of profits to platform</Fees.Value>
          </Fees.Row>
          <Fees.Row>
            <Fees.Value>REVA buyback rate:</Fees.Value>
            <Fees.Value>30% of profits</Fees.Value>
          </Fees.Row>
          <Fees.Row>
            <Fees.Value>Underlying vault deposit fee:</Fees.Value>
            <Fees.Value>{`${feesData.depositFeePercentage}%`}</Fees.Value>
          </Fees.Row>
          <Fees.Row>
            <Fees.Value>Underlying vault withdrawal fee:</Fees.Value>
            <Fees.Value>{`${feesData.withdrawalFeePercentage}%`}</Fees.Value>
          </Fees.Row>
        </>
      )}
    </Fees>
  );
}

VaultFees.propTypes = {
  vaultId: PropTypes.string.isRequired,
};

export default VaultFees;

/** Styled Components */

export const Fees = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

Fees.Title = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-transform: uppercase;
  color: ${colorGrayscaleBody};
`;

Fees.Row = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${colorGrayscalePlaceholder};
  align-items: center;
  justify-content: space-between;
`;

Fees.Value = styled.div``;
