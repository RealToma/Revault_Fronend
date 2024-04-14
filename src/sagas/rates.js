import { RevaApi } from "../apis";
import { stringToBigNumber } from "../helpers/utils";

export async function fetchTokenToBusdRate({ tokenId }) {
  try {
    const revaApi = RevaApi();
    const data = await revaApi.getTokenToBusdRate(tokenId);

    return stringToBigNumber(data);
  } catch (error) {
    console.log(error);
    return undefined;
  }
}
