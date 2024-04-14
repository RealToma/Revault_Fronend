import { useMutation } from "react-query";
import {
  deposit,
  zapAndDeposit,
  withdraw,
  withdrawAll,
  rebalance,
  claim,
} from "../sagas/vaults";
import { onTransaction } from "../utils";

export const useDeposit = ({ onSuccess }) => {
  const depositMutation = useMutation(
    async (params) => {
      const txHash = await deposit(params);
      await onTransaction({
        txHash,
      });

      return txHash;
    },
    {
      onSuccess,
    },
  );

  return depositMutation;
};

export const useZapAndDeposit = ({ onSuccess }) => {
  const zapAndDepositMutation = useMutation(
    async (params) => {
      const txHash = await zapAndDeposit(params);
      await onTransaction({
        txHash,
      });

      return txHash;
    },
    {
      onSuccess,
    },
  );

  return zapAndDepositMutation;
};

export const useWithdraw = ({ onSuccess }) => {
  const withdrawMutation = useMutation(
    async (params) => {
      const txHash = await (params.isMax
        ? withdrawAll(params)
        : withdraw(params));
      await onTransaction({
        txHash,
      });

      return { txHash, ...params };
    },
    {
      onSuccess,
    },
  );

  return withdrawMutation;
};

export const useRebalance = ({ onMutate, onSuccess }) => {
  const rebalanceMutation = useMutation(
    async (params) => {
      const txHash = await rebalance(params);
      await onTransaction({
        txHash,
      });

      return txHash;
    },
    {
      onMutate,
      onSuccess,
    },
  );

  return rebalanceMutation;
};

export const useClaim = ({ onSuccess }) => {
  const claimMutation = useMutation(
    async (params) => {
      const txHash = await claim(params);
      await onTransaction({
        txHash,
      });

      return txHash;
    },
    {
      onSuccess,
    },
  );

  return claimMutation;
};
