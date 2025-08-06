import { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';

import { BaseIntention } from '@/apps/interface';

import config from '../config';
import { TransactionSubType } from '../types';

export interface UnstakeIntentionData {
  wrapper: string;
  metadata: string;
  cert: string;
  ctx: string;
}

export class UnstakeIntention extends BaseIntention<UnstakeIntentionData> {
  txType: TransactionType.Staking;

  txSubType: TransactionSubType.UNSTAKE;

  constructor(public readonly data: UnstakeIntentionData) {
    super(data);
  }

  async build(input: { client: IotaClient; account: WalletAccount }): Promise<Transaction> {
    const { client, account } = input;

    const transaction = new Transaction();

    transaction.setSender(account.address);

    transaction.moveCall({
      package: config.moduleId,
      module: config.nativePoolEntry,
      function: config.unstakeMethod,
      arguments: [
        transaction.object(this.data.wrapper),
        transaction.object(this.data.metadata),
        transaction.object(this.data.cert),
        transaction.object(this.data.ctx),
      ],
    });

    return transaction;
  }

  static fromData(data: UnstakeIntentionData) {
    return new UnstakeIntention(data);
  }
}
