import { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { IotaSignTransactionInput, WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';

import { MSafeAppHelper } from '@/apps/interface';
import { IotaNetworks } from '@/types';

import { Decoder } from './decoder';
import { ChangeBaseRewardFeeIntention, ChangeBaseRewardFeeIntentionData } from './intentions/changeBaseRewardFee';
import { ChangeMinStakeIntention, ChangeMinStakeIntentionData } from './intentions/changeMinStake';
import { StakeIntention, StakeIntentionData } from './intentions/stake';
import { UnstakeIntention, UnstakeIntentionData } from './intentions/unstake';
import { UpdateRewardsRevertIntention, UpdateRewardsRevertIntentionData } from './intentions/updateRewardsRevert';
import {
  UpdateRewardsThresholdIntention,
  UpdateRewardsThresholdIntentionData,
} from './intentions/updateRewardsThreshold';
import { TransactionSubType } from './types';

export type SwirlIntention =
  | ChangeBaseRewardFeeIntention
  | ChangeMinStakeIntention
  | StakeIntention
  | UnstakeIntention
  | UpdateRewardsRevertIntention
  | UpdateRewardsThresholdIntention;

export type SwirlIntentionData =
  | ChangeBaseRewardFeeIntentionData
  | ChangeMinStakeIntentionData
  | StakeIntentionData
  | UnstakeIntentionData
  | UpdateRewardsRevertIntentionData
  | UpdateRewardsThresholdIntentionData;

export class SwirlAppHelper implements MSafeAppHelper<SwirlIntentionData> {
  application = 'Swirl';

  async deserialize(
    input: IotaSignTransactionInput & {
      network: IotaNetworks;
      client: IotaClient;
      account: WalletAccount;
    },
  ): Promise<{ txType: TransactionType; txSubType: string; intentionData: SwirlIntentionData }> {
    const decoder = new Decoder(input);
    const result = await decoder.decode();

    return {
      txType: result.txType,
      txSubType: result.type,
      intentionData: result.intentionData,
    };
  }

  async build(input: {
    network: string;
    txType: TransactionType;
    txSubType: string;
    intentionData: SwirlIntentionData;
    client: IotaClient;
    account: WalletAccount;
  }): Promise<Transaction> {
    const { client, account, txSubType, intentionData } = input;

    let intention: SwirlIntention;

    switch (txSubType) {
      case TransactionSubType.CHANGE_BASE_REWARD_FEE:
        intention = ChangeBaseRewardFeeIntention.fromData(intentionData as ChangeBaseRewardFeeIntentionData);
        break;
      case TransactionSubType.CHANGE_MIN_STAKE:
        intention = ChangeMinStakeIntention.fromData(intentionData as ChangeMinStakeIntentionData);
        break;
      case TransactionSubType.STAKE:
        intention = StakeIntention.fromData(intentionData as StakeIntentionData);
        break;
      case TransactionSubType.UNSTAKE:
        intention = UnstakeIntention.fromData(intentionData as UnstakeIntentionData);
        break;
      case TransactionSubType.UPDATE_REWARDS_REVERT:
        intention = UpdateRewardsRevertIntention.fromData(intentionData as UpdateRewardsRevertIntentionData);
        break;
      case TransactionSubType.UPDATE_REWARDS_THRESHOLD:
        intention = UpdateRewardsThresholdIntention.fromData(intentionData as UpdateRewardsThresholdIntentionData);
        break;
      default:
        throw new Error(`Unsupported transaction subtype: ${txSubType}`);
    }

    return intention.build({ client, account });
  }
}
