import { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';

import { BaseIntention } from '@/apps/interface';
import { ManagePositionIntentionData } from '@/apps/virtue/types/api';
import { IotaNetworks } from '@/types';

import { getManagePositionTx } from '../api/lending';
import { TransactionSubType } from '../types';

export class ManagePositionIntention extends BaseIntention<ManagePositionIntentionData> {
  txType = TransactionType.Other;

  txSubType = TransactionSubType.ManagePosition;

  constructor(public readonly data: ManagePositionIntentionData) {
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
    const tx = await getManagePositionTx(this.data, account, network);
    return tx;
  }

  static fromData(data: ManagePositionIntentionData) {
    return new ManagePositionIntention(data);
  }
}
