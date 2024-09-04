import { TransactionType } from '@msafe/sui3-utils';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { WalletAccount } from '@mysten/wallet-standard';

import { CoreBaseIntention } from '@/apps/msafe-core/intention';

import { getAddLiquidityTxb } from '../api/position';
import { CetusIntentionData, TransactionSubType, SuiNetworks } from '../types';

export class AddLiquidityIntention extends CoreBaseIntention<CetusIntentionData> {
  txType = TransactionType.Other;

  txSubType = TransactionSubType.OpenAndAddLiquidity;

  constructor(public readonly data: CetusIntentionData) {
    super(data);
  }

  async build(input: { suiClient: SuiClient; account: WalletAccount; network: SuiNetworks }): Promise<Transaction> {
    const { account, network } = input;
    const { txbParams } = this.data;
    const txb = await getAddLiquidityTxb(txbParams, account, network);
    return txb;
  }

  static fromData(data: CetusIntentionData) {
    return new AddLiquidityIntention(data);
  }
}
