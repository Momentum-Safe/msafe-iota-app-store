import { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';

import { BaseIntention } from '@/apps/interface';

import config from '../config';
import { TransactionSubType } from '../types';

export interface UpdateRewardsRevertIntentionData {
  value: string;
  owner_cap: string;
}

export class UpdateRewardsRevertIntention extends BaseIntention<UpdateRewardsRevertIntentionData> {
  txType: TransactionType.Staking;

  txSubType: TransactionSubType.UPDATE_REWARDS_REVERT;

  constructor(public readonly data: UpdateRewardsRevertIntentionData) {
    super(data);
  }

  async build(input: { client: IotaClient; account: WalletAccount }): Promise<Transaction> {
    const { client, account } = input;

    const transaction = new Transaction();

    transaction.setSender(account.address);

    transaction.moveCall({
      package: config.moduleId,
      module: config.nativePoolEntry,
      function: config.updateRewardsRevertMethod,
      arguments: [
        transaction.pure.u64(this.data.value),
        transaction.object(this.data.owner_cap),
      ],
    });

    return transaction;
  }

  static fromData(data: UpdateRewardsRevertIntentionData) {
    return new UpdateRewardsRevertIntention(data);
  }
}
