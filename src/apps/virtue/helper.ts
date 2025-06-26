import { IotaClient } from '@iota/iota-sdk/dist/cjs/client';
import { Transaction } from '@iota/iota-sdk/dist/cjs/transactions';
import { IotaSignTransactionInput, WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';

import { IotaNetworks } from '@/types';

import { Decoder } from './decoder';
import { MSafeAppHelper } from '../interface';
import { DepositStabilityPoolIntention, WithdrawStabilityPoolIntention } from './intentions/depositStabilityPool';
import { ManagePositionIntention } from './intentions/managePosition';
import { TransactionSubType } from './types';
import {
  DepositStabilityPoolIntentionData,
  ManagePositionIntentionData,
  WithdrawStabilityPoolIntentionData,
} from './types/api';
import { VirtueIntentionData } from './types/helper';

export type VirtueIntention = ManagePositionIntention | DepositStabilityPoolIntention | WithdrawStabilityPoolIntention;

export class VirtueHelper implements MSafeAppHelper<VirtueIntentionData> {
  application = 'virtue';

  async deserialize(
    input: IotaSignTransactionInput & { network: IotaNetworks; client: IotaClient; account: WalletAccount },
  ): Promise<{ txType: TransactionType; txSubType: string; intentionData: VirtueIntentionData }> {
    const decoder = new Decoder(input);
    const result = await decoder.decode();

    return {
      txType: TransactionType.Other,
      txSubType: result.type,
      intentionData: result.intentionData,
    };
  }

  async build(input: {
    network: string;
    txType: TransactionType;
    txSubType: string;
    intentionData: VirtueIntentionData;
    client: IotaClient;
    account: WalletAccount;
  }): Promise<Transaction> {
    const { client, account, network, txType, txSubType } = input;

    let intention: VirtueIntention;

    switch (input.txSubType) {
      case TransactionSubType.ManagePosition:
        intention = ManagePositionIntention.fromData(input.intentionData as ManagePositionIntentionData);
        break;
      case TransactionSubType.DepositStabilityPool:
        intention = DepositStabilityPoolIntention.fromData(input.intentionData as DepositStabilityPoolIntentionData);
        break;
      case TransactionSubType.WithdrawStabilityPool:
        intention = WithdrawStabilityPoolIntention.fromData(input.intentionData as WithdrawStabilityPoolIntentionData);
        break;
      default:
        throw new Error('not implemented');
    }

    return intention.build({ client, account, network: network as IotaNetworks, txType, txSubType });
  }
}
