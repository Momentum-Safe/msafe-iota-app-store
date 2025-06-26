import { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';

import { BaseIntention } from '@/apps/interface';
import { DepositStabilityPoolIntentionData, WithdrawStabilityPoolIntentionData } from '@/apps/virtue/types/api';
import { IotaNetworks } from '@/types';

import { getDepositStabilityPoolTx, getWithdrawStabilityPoolTx } from '../api/tank';
import { TransactionSubType } from '../types';

export class DepositStabilityPoolIntention extends BaseIntention<DepositStabilityPoolIntentionData> {
  txType = TransactionType.Other;

  txSubType = TransactionSubType.DepositStabilityPool;

  constructor(public readonly data: DepositStabilityPoolIntentionData) {
    super(data);
  }

  async build(input: {
    network: IotaNetworks;
    txType: TransactionType;
    txSubType: string;
    client: IotaClient;
    account: WalletAccount;
  }): Promise<Transaction> {
    const { account, network } = input;
    const tx = await getDepositStabilityPoolTx(this.data, account, network);
    return tx;
  }

  static fromData(data: DepositStabilityPoolIntentionData) {
    return new DepositStabilityPoolIntention(data);
  }
}

export class WithdrawStabilityPoolIntention extends BaseIntention<WithdrawStabilityPoolIntentionData> {
  txType = TransactionType.Other;

  txSubType = TransactionSubType.WithdrawStabilityPool;

  constructor(public readonly data: WithdrawStabilityPoolIntentionData) {
    super(data);
  }

  async build(input: {
    network: IotaNetworks;
    txType: TransactionType;
    txSubType: string;
    client: IotaClient;
    account: WalletAccount;
  }): Promise<Transaction> {
    const { account, network } = input;
    const tx = await getWithdrawStabilityPoolTx(this.data, account, network);
    return tx;
  }

  static fromData(data: WithdrawStabilityPoolIntentionData) {
    return new WithdrawStabilityPoolIntention(data);
  }
}
