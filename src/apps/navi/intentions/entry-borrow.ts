import { TransactionType } from '@msafe/sui3-utils';
import { Transaction } from '@mysten/sui/transactions';
import { WalletAccount } from '@mysten/wallet-standard';

import { CoreBaseIntention } from '@/apps/msafe-core/intention';

import { borrowToken } from '../api/incentiveV2';
import config from '../config';
import { CoinType, TransactionSubType } from '../types';

export interface EntryBorrowIntentionData {
  amount: number;
  coinType: CoinType;
}

export class EntryBorrowIntention extends CoreBaseIntention<EntryBorrowIntentionData> {
  txType: TransactionType.Other;

  txSubType: TransactionSubType.EntryBorrow;

  constructor(public readonly data: EntryBorrowIntentionData) {
    super(data);
  }

  async build(input: { account: WalletAccount }): Promise<Transaction> {
    const { coinType, amount } = this.data;
    const tx = new Transaction();
    console.log('build', this.data);

    const pool = config.pool[coinType];

    if (!pool) {
      throw new Error(`${coinType} not support, please use ${Object.keys(config.pool).join(', ')}.`);
    }

    return borrowToken(tx, pool, amount, input.account.address);
  }

  static fromData(data: EntryBorrowIntentionData) {
    return new EntryBorrowIntention(data);
  }
}
