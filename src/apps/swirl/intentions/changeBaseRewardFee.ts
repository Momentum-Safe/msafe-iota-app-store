import { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';

import { BaseIntention } from '@/apps/interface';

import config from '../config';
import { TransactionSubType } from '../types';

export interface ChangeBaseRewardFeeIntentionData {
  owner_cap: string;
  value: string;
}

export class ChangeBaseRewardFeeIntention extends BaseIntention<ChangeBaseRewardFeeIntentionData> {
  txType: TransactionType.Staking;

  txSubType: TransactionSubType.CHANGE_BASE_REWARD_FEE;

  constructor(public readonly data: ChangeBaseRewardFeeIntentionData) {
    super(data);
  }

  async build(input: { client: IotaClient; account: WalletAccount }): Promise<Transaction> {
    const { client, account } = input;

    const transaction = new Transaction();

    transaction.setSender(account.address);

    transaction.moveCall({
      package: config.moduleId,
      module: config.nativePoolEntry,
      function: config.changeBaseRewardFeeMethod,
      arguments: [transaction.object(this.data.owner_cap), transaction.pure.u64(this.data.value)],
    });

    return transaction;
  }

  static fromData(data: ChangeBaseRewardFeeIntentionData) {
    return new ChangeBaseRewardFeeIntention(data);
  }
}
