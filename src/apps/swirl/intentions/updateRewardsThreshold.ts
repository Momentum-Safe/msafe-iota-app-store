import { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';

import { BaseIntention } from '@/apps/interface';

import config from '../config';
import { TransactionSubType } from '../types';

export interface UpdateRewardsThresholdIntentionData {
  owner_cap: string;
  value: string;
}

export class UpdateRewardsThresholdIntention extends BaseIntention<UpdateRewardsThresholdIntentionData> {
  txType: TransactionType.Staking;

  txSubType: TransactionSubType.UPDATE_REWARDS_THRESHOLD;

  constructor(public readonly data: UpdateRewardsThresholdIntentionData) {
    super(data);
  }

  async build(input: { client: IotaClient; account: WalletAccount }): Promise<Transaction> {
    const { client, account } = input;

    const transaction = new Transaction();

    transaction.setSender(account.address);

    transaction.moveCall({
      package: config.moduleId,
      module: config.nativePoolEntry,
      function: config.updateRewardsThresholdMethod,
      arguments: [transaction.object(this.data.owner_cap), transaction.pure.u64(this.data.value)],
    });

    return transaction;
  }

  static fromData(data: UpdateRewardsThresholdIntentionData) {
    return new UpdateRewardsThresholdIntention(data);
  }
}
