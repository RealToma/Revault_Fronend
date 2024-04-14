import { useMutation, useQuery, useQueryClient } from "react-query";
import { activateErrorNotification } from "../components/TransactionNotification/TransactionNotification";
import { QUERY_KEYS } from "../constants";
import { approveToken, hasUserApprovedToken } from "../sagas/approveToken";
import { onTransaction } from "../utils";

export const useIsTokenApproved = (params) => {
  const isTokenApprovedQuery = useQuery({
    queryKey: QUERY_KEYS.isTokenApproved,
    queryFn: async () => await hasUserApprovedToken(params),
  });

  return isTokenApprovedQuery;
};

export const useApproveToken = ({ params, onSuccess }) => {
  const queryClient = useQueryClient();

  const approveTokenMutation = useMutation(
    async (mutateParams) => {
      try {
        const data = await approveToken({ ...params, ...mutateParams });
        const { txHash } = data;
        await onTransaction({
          txHash,
          callback: () => {
            queryClient.invalidateQueries(QUERY_KEYS.isTokenApproved);
          },
        });

        return { ...data, ...mutateParams };
      } catch (error) {
        activateErrorNotification(error);
      }
    },
    {
      onSuccess,
    },
  );

  return approveTokenMutation;
};
