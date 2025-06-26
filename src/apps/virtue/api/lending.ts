import { Transaction } from '@iota/iota-sdk/transactions';
import { WalletAccount } from '@iota/wallet-standard';

import { IotaNetworks } from '@/types';

import { getVirtueClient } from './config';
import { ManagePositionIntentionData } from '../types/api';

export const getManagePositionTx = async (
  txbParams: ManagePositionIntentionData,
  account: WalletAccount,
  network: IotaNetworks,
): Promise<Transaction> => {
  const { collateralSymbol, depositAmount, borrowAmount, repaymentAmount, withdrawAmount, accountObjId, recipient } =
    txbParams;

  const virtueClient = getVirtueClient(network, account);
  const tx = await virtueClient.buildManagePositionTransaction({
    collateralSymbol,
    depositAmount,
    borrowAmount,
    repaymentAmount,
    withdrawAmount,
    accountObjId,
    recipient,
  });

  return tx;
};
