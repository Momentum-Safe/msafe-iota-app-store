import { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';

import { BaseIntention } from '@/apps/interface';

import config from '../config';
import { TransactionSubType } from '../types';

export interface ChangeMinStakeIntentionData {
  owner_cap: string;
  value: string;
}

export class ChangeMinStakeIntention extends BaseIntention<ChangeMinStakeIntentionData> {
  txType: TransactionType.Staking;

  txSubType: TransactionSubType.CHANGE_MIN_STAKE;

  constructor(public readonly data: ChangeMinStakeIntentionData) {
    super(data);
  }

  async build(input: { client: IotaClient; account: WalletAccount }): Promise<Transaction> {
    const { client, account } = input;

    const transaction = new Transaction();

    transaction.setSender(account.address);

    transaction.moveCall({
      package: config.moduleId,
      module: config.nativePoolEntry,
      function: config.changeMinStakeMethod,
      arguments: [transaction.object(this.data.owner_cap), transaction.pure.u64(this.data.value)],
    });

    return transaction;
  }

  static fromData(data: ChangeMinStakeIntentionData) {
    return new ChangeMinStakeIntention(data);
  }
}
