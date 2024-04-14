import { useAsync } from "react-use";
import { RevaApi } from "../apis";

export const useRevaStats = () => {
  const revaApi = RevaApi();

  const stats = useAsync(async () => {
    const data = await revaApi.stats();

    return data;
  }, []);

  return stats;
};
