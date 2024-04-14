import { Observable } from "rxjs";
import Web3 from "web3";
import { NOTIFICATION_TYPES } from "@src/constants";

const WEB3_URL_PROVIDER =
  require("../../config/config").config.getProviderUrl();

function txHashStatus(txHash) {
  const txObservable = new Observable((subscriber) => {
    const provider = new Web3(WEB3_URL_PROVIDER);
    (async () => {
      let retries = 90;
      subscriber.next({ state: NOTIFICATION_TYPES.PENDING, txHash });
      for (let index = 0; index < retries; index++) {
        let txBlock = await provider.eth.getTransaction(txHash);
        if (txBlock && txBlock.blockNumber) {
          let currentBlock = await provider.eth.getBlockNumber();
          let confirmations = currentBlock - txBlock.blockNumber;
          if (confirmations >= 3) {
            const receipt = await provider.eth.getTransactionReceipt(txHash);
            if (!receipt || !receipt.status) {
              subscriber.next({ state: NOTIFICATION_TYPES.FAILED, txHash });
              subscriber.error("TX Failed");
              subscriber.complete();
            } else {
              subscriber.next({ state: NOTIFICATION_TYPES.CONFIRMED, txHash });
              subscriber.complete();
            }

            return;
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      subscriber.next({ state: NOTIFICATION_TYPES.REJECTED, txHash });
      subscriber.error("Could not find TX");
      subscriber.complete();
    })();
  });

  return txObservable;
}

export { txHashStatus };
