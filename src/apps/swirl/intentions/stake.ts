import { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';

import { BaseIntention } from '@/apps/interface';

import config from '../config';
import { TransactionSubType } from '../types';

export interface StakeIntentionData {
  metadata: string;
  wrapper: string;
  coin: string;
  ctx: string;
}

export class StakeIntention extends BaseIntention<StakeIntentionData> {
  txType: TransactionType.Staking;

  txSubType: TransactionSubType.STAKE;

  constructor(public readonly data: StakeIntentionData) {
    super(data);
  }

  async build(input: { client: IotaClient; account: WalletAccount }): Promise<Transaction> {
    const { client, account } = input;

    const transaction = new Transaction();

    transaction.setSender(account.address);

    transaction.moveCall({
      package: config.moduleId,
      module: config.nativePoolEntry,
      function: config.stakeMethod,
      arguments: [
        transaction.object(this.data.metadata),
        transaction.object(this.data.wrapper),
        transaction.object(this.data.coin),
        transaction.object(this.data.ctx),
      ],
    });

    return transaction;
  }

  static fromData(data: StakeIntentionData) {
    return new StakeIntention(data);
  }
}
