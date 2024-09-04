import { SuiNetworks, TransactionSubType } from '../types';
import { TransactionType } from '@msafe/sui3-utils';
import { Transaction } from '@mysten/sui/transactions';
import { Pool } from 'turbos-clmm-sdk';
import { SuiClient } from '@mysten/sui/client';
import { WalletAccount } from '@mysten/wallet-standard';
import { TurbosSdk, Network } from 'turbos-clmm-sdk';
import { CoreBaseIntention } from '@/apps/msafe-core/intention';

interface ClaimAllParams extends Pool.CollectFeeOptions, Pool.CollectRewardOptions {}

export interface ClaimAllIntentionData {
  positions: ClaimAllParams[];
}

export class ClaimAllIntention extends CoreBaseIntention<ClaimAllIntentionData> {
  txType!: TransactionType.Other;

  txSubType!: TransactionSubType.ClaimAll;

  constructor(public override readonly data: ClaimAllIntentionData) {
    super(data);
  }

  async build(input: { suiClient: SuiClient; account: WalletAccount; network: SuiNetworks }): Promise<Transaction> {
    const turbosSdk = new TurbosSdk(input.network.replace('sui:', '') as Network, input.suiClient);
    let txb = new Transaction();

    for (let i = 0; i < this.data.positions.length; i++) {
      const position = this.data.positions[i];

      if (position.collectAmountA !== '0' || position.collectAmountB !== '0') {
        txb = await turbosSdk.pool.collectFee({ txb, ...position });
      }

      if (position.rewardAmounts.some((amount) => amount !== '0' && amount === 0)) {
        txb = await turbosSdk.pool.collectReward({ txb, ...position });
      }
    }

    return txb;
  }

  static fromData(data: ClaimAllIntentionData) {
    return new ClaimAllIntention(data);
  }
}
