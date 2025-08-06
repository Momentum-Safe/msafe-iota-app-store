import { TransactionType } from '@msafe/iota-utils';
import { ChangeBaseRewardFeeIntention, ChangeBaseRewardFeeIntentionData } from '@/apps/swirl/intentions/changeBaseRewardFee';
import { ChangeMinStakeIntention, ChangeMinStakeIntentionData } from '@/apps/swirl/intentions/changeMinStake';
import { StakeIntention, StakeIntentionData } from '@/apps/swirl/intentions/stake';
import { UnstakeIntention, UnstakeIntentionData } from '@/apps/swirl/intentions/unstake';
import { UpdateRewardsRevertIntention, UpdateRewardsRevertIntentionData } from '@/apps/swirl/intentions/updateRewardsRevert';
import {
  UpdateRewardsThresholdIntention,
  UpdateRewardsThresholdIntentionData,
} from '@/apps/swirl/intentions/updateRewardsThreshold';
import { TransactionSubType } from '@/apps/swirl/types';
import { appHelpers } from '@/index';

import { Account, Client } from './config';

describe('Swirl Wallet', () => {
  const appHelper = appHelpers.getAppHelper('Swirl');

  it('Should get correct app helper', () => {
    expect(appHelper.application).toBe('Swirl');
  });

  describe('Build/Serialize', () => {
    it('Change Base Reward Fee transaction build', async () => {
      const intentionData: ChangeBaseRewardFeeIntentionData = {
        owner_cap: '0x0000000000000000000000000000000000000000000000000000000000000001',
        value: '1000000000', // 1 IOTA
      };

      const res = await appHelper.build({
        network: 'iota:testnet',
        txType: TransactionType.Staking,
        txSubType: TransactionSubType.CHANGE_BASE_REWARD_FEE,
        client: Client,
        account: Account,
        intentionData,
      });

      const txData = res.getData();
      expect(txData.sender).toBe(Account.address);
      expect(txData.commands).toHaveLength(1);
      expect(txData.commands[0].$kind).toBe('MoveCall');
    });

    it('Change Base Reward Fee intention serialization', () => {
      const intentionData: ChangeBaseRewardFeeIntentionData = {
        owner_cap: '0x0000000000000000000000000000000000000000000000000000000000000001',
        value: '1000000000', // 1 IOTA
      };

      const intention = ChangeBaseRewardFeeIntention.fromData(intentionData);
      const serialized = intention.serialize();
      const parsed = JSON.parse(serialized);

      expect(parsed.value).toBe(intentionData.value);
      expect(parsed.owner_cap).toBe(intentionData.owner_cap);
    });

    it('Change MinStake transaction build', async () => {
      const intentionData: ChangeMinStakeIntentionData = {
        owner_cap: '0x0000000000000000000000000000000000000000000000000000000000000001',
        value: '1000000000', // 1 IOTA
      };

      const res = await appHelper.build({
        network: 'iota:testnet',
        txType: TransactionType.Staking,
        txSubType: TransactionSubType.CHANGE_MIN_STAKE,
        client: Client,
        account: Account,
        intentionData,
      });

      const txData = res.getData();
      expect(txData.sender).toBe(Account.address);
      expect(txData.commands).toHaveLength(1);
      expect(txData.commands[0].$kind).toBe('MoveCall');
    });

    it('Change MinStake intention serialization', () => {
      const intentionData: ChangeMinStakeIntentionData = {
        owner_cap: '0x0000000000000000000000000000000000000000000000000000000000000001',
        value: '1000000000', // 1 IOTA
      };

      const intention = ChangeMinStakeIntention.fromData(intentionData);
      const serialized = intention.serialize();
      const parsed = JSON.parse(serialized);

      expect(parsed.value).toBe(intentionData.value);
      expect(parsed.owner_cap).toBe(intentionData.owner_cap);
    });

    it('Stake transaction build', async () => {
      const intentionData: StakeIntentionData = {
        metadata: '0x0000000000000000000000000000000000000000000000000000000000000001',
        wrapper: '0x0000000000000000000000000000000000000000000000000000000000000002',
        coin: '0x0000000000000000000000000000000000000000000000000000000000000003',
        ctx: '0x0000000000000000000000000000000000000000000000000000000000000004',
      };

      const res = await appHelper.build({
        network: 'iota:testnet',
        txType: TransactionType.Staking,
        txSubType: TransactionSubType.STAKE,
        client: Client,
        account: Account,
        intentionData,
      });

      const txData = res.getData();
      expect(txData.sender).toBe(Account.address);
      expect(txData.commands).toHaveLength(1);
      expect(txData.commands[0].$kind).toBe('MoveCall');
    });

    it('Stake intention serialization', () => {
      const intentionData: StakeIntentionData = {
        metadata: '0x0000000000000000000000000000000000000000000000000000000000000001',
        wrapper: '0x0000000000000000000000000000000000000000000000000000000000000002',
        coin: '0x0000000000000000000000000000000000000000000000000000000000000003',
        ctx: '0x0000000000000000000000000000000000000000000000000000000000000004',
      };

      const intention = StakeIntention.fromData(intentionData);
      const serialized = intention.serialize();
      const parsed = JSON.parse(serialized);

      expect(parsed.metadata).toBe(intentionData.metadata);
      expect(parsed.wrapper).toBe(intentionData.wrapper);
      expect(parsed.coin).toBe(intentionData.coin);
      expect(parsed.ctx).toBe(intentionData.ctx);
    });

    it('Unstake transaction build', async () => {
      const intentionData: UnstakeIntentionData = {
        metadata: '0x0000000000000000000000000000000000000000000000000000000000000001',
        wrapper: '0x0000000000000000000000000000000000000000000000000000000000000002',
        cert: '0x0000000000000000000000000000000000000000000000000000000000000003',
        ctx: '0x0000000000000000000000000000000000000000000000000000000000000004',
      };

      const res = await appHelper.build({
        network: 'iota:testnet',
        txType: TransactionType.Staking,
        txSubType: TransactionSubType.UNSTAKE,
        client: Client,
        account: Account,
        intentionData,
      });

      const txData = res.getData();
      expect(txData.sender).toBe(Account.address);
      expect(txData.commands).toHaveLength(1);
      expect(txData.commands[0].$kind).toBe('MoveCall');
    });

    it('Unstake intention serialization', () => {
      const intentionData: UnstakeIntentionData = {
        metadata: '0x0000000000000000000000000000000000000000000000000000000000000001',
        wrapper: '0x0000000000000000000000000000000000000000000000000000000000000002',
        cert: '0x0000000000000000000000000000000000000000000000000000000000000003',
        ctx: '0x0000000000000000000000000000000000000000000000000000000000000004',
      };

      const intention = UnstakeIntention.fromData(intentionData);
      const serialized = intention.serialize();
      const parsed = JSON.parse(serialized);

      expect(parsed.metadata).toBe(intentionData.metadata);
      expect(parsed.wrapper).toBe(intentionData.wrapper);
      expect(parsed.cert).toBe(intentionData.cert);
      expect(parsed.ctx).toBe(intentionData.ctx);
    });

    it('Update Rewards Revert transaction build', async () => {
      const intentionData: UpdateRewardsRevertIntentionData = {
        owner_cap: '0x0000000000000000000000000000000000000000000000000000000000000001',
        value: '1000000000', // 1 IOTA
      };

      const res = await appHelper.build({
        network: 'iota:testnet',
        txType: TransactionType.Staking,
        txSubType: TransactionSubType.UPDATE_REWARDS_REVERT,
        client: Client,
        account: Account,
        intentionData,
      });

      const txData = res.getData();
      expect(txData.sender).toBe(Account.address);
      expect(txData.commands).toHaveLength(1);
      expect(txData.commands[0].$kind).toBe('MoveCall');
    });

    it('Update Rewards Revert intention serialization', () => {
      const intentionData: UpdateRewardsRevertIntentionData = {
        owner_cap: '0x0000000000000000000000000000000000000000000000000000000000000001',
        value: '1000000000', // 1 IOTA
      };

      const intention = UpdateRewardsRevertIntention.fromData(intentionData);
      const serialized = intention.serialize();
      const parsed = JSON.parse(serialized);

      expect(parsed.value).toBe(intentionData.value);
      expect(parsed.owner_cap).toBe(intentionData.owner_cap);
    });

    it('Update Rewards Threshold transaction build', async () => {
      const intentionData: UpdateRewardsThresholdIntentionData = {
        owner_cap: '0x0000000000000000000000000000000000000000000000000000000000000001',
        value: '1000000000', // 1 IOTA
      };

      const res = await appHelper.build({
        network: 'iota:testnet',
        txType: TransactionType.Staking,
        txSubType: TransactionSubType.UPDATE_REWARDS_THRESHOLD,
        client: Client,
        account: Account,
        intentionData,
      });

      const txData = res.getData();
      expect(txData.sender).toBe(Account.address);
      expect(txData.commands).toHaveLength(1);
      expect(txData.commands[0].$kind).toBe('MoveCall');
    });

    it('Update Rewards Threshold intention serialization', () => {
      const intentionData: UpdateRewardsThresholdIntentionData = {
        owner_cap: '0x0000000000000000000000000000000000000000000000000000000000000001',
        value: '1000000000', // 1 IOTA
      };

      const intention = UpdateRewardsThresholdIntention.fromData(intentionData);
      const serialized = intention.serialize();
      const parsed = JSON.parse(serialized);

      expect(parsed.value).toBe(intentionData.value);
      expect(parsed.owner_cap).toBe(intentionData.owner_cap);
    });
  });
});
