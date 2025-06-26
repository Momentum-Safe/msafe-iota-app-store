import { Transaction } from '@iota/iota-sdk/transactions';
import { WalletAccount } from '@iota/wallet-standard';

import { IotaNetworks } from '@/types';

import { getVirtueClient } from './config';
import { DepositStabilityPoolIntentionData, WithdrawStabilityPoolIntentionData } from '../types/api';

export const getDepositStabilityPoolTx = async (
  txbParams: DepositStabilityPoolIntentionData,
  account: WalletAccount,
  network: IotaNetworks,
): Promise<Transaction> => {
  const { depositAmount } = txbParams;

  const virtueClient = getVirtueClient(network, account);
  const tx = await virtueClient.buildDepositStabilityPoolTransaction({ depositAmount });

  return tx;
};

export const getWithdrawStabilityPoolTx = async (
  txbParams: WithdrawStabilityPoolIntentionData,
  account: WalletAccount,
  network: IotaNetworks,
): Promise<Transaction> => {
  const { withdrawAmount } = txbParams;

  const virtueClient = getVirtueClient(network, account);
  const tx = await virtueClient.buildWithdrawStabilityPoolTransaction({ withdrawAmount });

  return tx;
};
