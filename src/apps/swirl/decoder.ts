import { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { IotaSignTransactionInput, WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';

import { IotaNetworks } from '@/types';

import config from './config';
import { TransactionSubType } from './types';

type DecodeResult = {
  txType: TransactionType;
  type: TransactionSubType;
  intentionData: any;
};

export class Decoder {
  constructor(
    private readonly input: IotaSignTransactionInput & {
      network: IotaNetworks;
      client: IotaClient;
      account: WalletAccount;
    },
  ) {}

  async decode(): Promise<DecodeResult> {
    const { transaction } = this.input;

    const txContent = await transaction.toJSON();
    const tx = Transaction.from(txContent);

    const txData = tx.getData();
    this.txInputs = txData.inputs || [];

    if (this.isChangeBaseRewardFeeTransaction(txData)) {
      return this.decodeChangeBaseRewardFee(txData);
    }
    if (this.isChangeMinStakeTransaction(txData)) {
      return this.decodeChangeMinStake(txData);
    }
    if (this.isStakeTransaction(txData)) {
      return this.decodeStake(txData);
    }
    if (this.isUnstakeTransaction(txData)) {
      return this.decodeUnstake(txData);
    }
    if (this.isUpdateRewardsRevertTransaction(txData)) {
      return this.decodeUpdateRewardsRevert(txData);
    }
    if (this.isUpdateRewardsThresholdTransaction(txData)) {
      return this.decodeUpdateRewardsThreshold(txData);
    }

    throw new Error('Unknown transaction type');
  }

  // Store transaction inputs for value extraction
  private txInputs: any[] = [];

  private isChangeBaseRewardFeeTransaction(txData: any): boolean {
    return this.hasMoveCallWithTarget(
      txData,
      config.moduleId,
      config.nativePoolEntry,
      config.changeBaseRewardFeeMethod,
    );
  }

  private isChangeMinStakeTransaction(txData: any): boolean {
    return this.hasMoveCallWithTarget(txData, config.moduleId, config.nativePoolEntry, config.changeMinStakeMethod);
  }

  private isStakeTransaction(txData: any): boolean {
    return this.hasMoveCallWithTarget(txData, config.moduleId, config.nativePoolEntry, config.stakeMethod);
  }

  private isUnstakeTransaction(txData: any): boolean {
    return this.hasMoveCallWithTarget(txData, config.moduleId, config.nativePoolEntry, config.unstakeMethod);
  }

  private isUpdateRewardsRevertTransaction(txData: any): boolean {
    return this.hasMoveCallWithTarget(
      txData,
      config.moduleId,
      config.nativePoolEntry,
      config.updateRewardsRevertMethod,
    );
  }

  private isUpdateRewardsThresholdTransaction(txData: any): boolean {
    return this.hasMoveCallWithTarget(
      txData,
      config.moduleId,
      config.nativePoolEntry,
      config.updateRewardsThresholdMethod,
    );
  }

  // ========== DECODE METHODS ==========

  private decodeChangeBaseRewardFee(txData: any): DecodeResult {
    const moveCallCmd = this.getMoveCallCommand(
      txData,
      config.moduleId,
      config.nativePoolEntry,
      config.changeBaseRewardFeeMethod,
    );

    if (!moveCallCmd || !moveCallCmd.MoveCall) {
      throw new Error('Invalid change_base_reward_fee transaction structure');
    }

    const { arguments: args } = moveCallCmd.MoveCall;

    if (!args || args.length < 2) {
      throw new Error('Invalid change_base_reward_fee payload structure');
    }

    const ownerCap = this.extractObjectId(args[0]);
    const value = this.extractU64Value(args[1]);

    return {
      txType: TransactionType.Staking,
      type: TransactionSubType.CHANGE_BASE_REWARD_FEE,
      intentionData: {
        owner_cap: ownerCap,
        value: value.toString(),
      },
    };
  }

  private decodeChangeMinStake(txData: any): DecodeResult {
    const moveCallCmd = this.getMoveCallCommand(
      txData,
      config.moduleId,
      config.nativePoolEntry,
      config.changeMinStakeMethod,
    );

    if (!moveCallCmd || !moveCallCmd.MoveCall) {
      throw new Error('Invalid change_min_stake transaction structure');
    }

    const { arguments: args } = moveCallCmd.MoveCall;

    if (!args || args.length < 2) {
      throw new Error('Invalid change_min_stake payload structure');
    }

    const ownerCap = this.extractObjectId(args[0]);
    const value = this.extractU64Value(args[1]);

    return {
      txType: TransactionType.Staking,
      type: TransactionSubType.CHANGE_MIN_STAKE,
      intentionData: {
        owner_cap: ownerCap,
        value: value.toString(),
      },
    };
  }

  private decodeStake(txData: any): DecodeResult {
    const moveCallCmd = this.getMoveCallCommand(txData, config.moduleId, config.nativePoolEntry, config.stakeMethod);

    if (!moveCallCmd || !moveCallCmd.MoveCall) {
      throw new Error('Invalid stake transaction structure');
    }

    const { arrguments: args } = moveCallCmd.MoveCall;

    if (!args || args.length < 4) {
      throw new Error('Invalid stake payload structure');
    }

    const metadata = this.extractObjectId(args[0]);
    const wrapper = this.extractObjectId(args[1]);
    const coin = this.extractObjectId(args[2]);
    const ctx = this.extractObjectId(args[3]);

    return {
      txType: TransactionType.Staking,
      type: TransactionSubType.STAKE,
      intentionData: {
        metadata,
        wrapper,
        coin,
        ctx,
      },
    };
  }

  private decodeUnstake(txData: any): DecodeResult {
    const moveCallCmd = this.getMoveCallCommand(txData, config.moduleId, config.nativePoolEntry, config.unstakeMethod);

    if (!moveCallCmd || !moveCallCmd.MoveCall) {
      throw new Error('Invalid unstake transaction structure');
    }

    const { arguments: args } = moveCallCmd.MoveCall;

    if (!args || args.length < 4) {
      throw new Error('Invalid unstake payload structure');
    }

    const wrapper = this.extractObjectId(args[0]);
    const metadata = this.extractObjectId(args[1]);
    const cert = this.extractObjectId(args[2]);
    const ctx = this.extractObjectId(args[3]);

    return {
      txType: TransactionType.Staking,
      type: TransactionSubType.UNSTAKE,
      intentionData: {
        wrapper,
        metadata,
        cert,
        ctx,
      },
    };
  }

  private decodeUpdateRewardsRevert(txData: any): DecodeResult {
    const moveCallCmd = this.getMoveCallCommand(
      txData,
      config.moduleId,
      config.nativePoolEntry,
      config.updateRewardsRevertMethod,
    );

    if (!moveCallCmd || !moveCallCmd.MoveCall) {
      throw new Error('Invalid update_reward_reverts transaction structure');
    }

    const { arguments: args } = moveCallCmd.MoveCall;

    if (!args || args.length < 2) {
      throw new Error('Invalid update_reward_reverts payload structure');
    }

    const ownerCap = this.extractObjectId(args[0]);
    const value = this.extractU64Value(args[1]);

    return {
      txType: TransactionType.Staking,
      type: TransactionSubType.UPDATE_REWARDS_REVERT,
      intentionData: {
        value: value.toString(),
        owner_cap: ownerCap,
      },
    };
  }

  private decodeUpdateRewardsThreshold(txData: any): DecodeResult {
    const moveCallCmd = this.getMoveCallCommand(
      txData,
      config.moduleId,
      config.nativePoolEntry,
      config.updateRewardsThresholdMethod,
    );

    if (!moveCallCmd || !moveCallCmd.MoveCall) {
      throw new Error('Invalid update_reward_threshold transaction structure');
    }

    const { arguments: args } = moveCallCmd.MoveCall;

    if (!args || args.length < 2) {
      throw new Error('Invalid update_reward_threshold payload structure');
    }

    const ownerCap = this.extractObjectId(args[0]);
    const value = this.extractU64Value(args[1]);

    return {
      txType: TransactionType.Staking,
      type: TransactionSubType.UPDATE_REWARDS_REVERT,
      intentionData: {
        owner_cap: ownerCap,
        value: value.toString(),
      },
    };
  }

  // ========== HELPER METHODS ==========
  private hasMoveCallWithTarget(txData: any, packageId: string, module: string, functionName: string): boolean {
    if (!txData || !txData.commands) {
      return false;
    }

    return txData.commands.some(
      (cmd: any) =>
        cmd.$kind === 'MoveCall' &&
        cmd.MoveCall &&
        cmd.MoveCall.package === packageId &&
        cmd.MoveCall.module === module &&
        cmd.MoveCall.function === functionName,
    );
  }

  private getMoveCallCommand(txData: any, packageId: string, module: string, functionName: string): any {
    if (!txData || !txData.commands) {
      return null;
    }

    return txData.commands.find(
      (cmd: any) =>
        cmd.$kind === 'MoveCall' &&
        cmd.MoveCall &&
        cmd.MoveCall.package === packageId &&
        cmd.MoveCall.module === module &&
        cmd.MoveCall.function === functionName,
    );
  }

  private extractObjectId(arg: any): string {
    // Handle Input references
    if (arg && arg.$kind === 'Input' && typeof arg.Input === 'number') {
      const inputIndex = arg.Input;
      if (this.txInputs && this.txInputs[inputIndex]) {
        const input = this.txInputs[inputIndex];

        // Handle UnresolvedObject type
        if (input.$kind === 'UnresolvedObject' && input.UnresolvedObject && input.UnresolvedObject.objectId) {
          return input.UnresolvedObject.objectId;
        }

        // Handle other input types
        if (input.type === 'object' && input.objectId) {
          return input.objectId;
        }
        if (input.type === 'pure' && input.value) {
          return String(input.value);
        }
        if (typeof input === 'string') {
          return input;
        }
        if (input.Object && typeof input.Object === 'string') {
          return input.Object;
        }
        if (input.Object && input.Object.ImmOrOwned) {
          return input.Object.ImmOrOwned;
        }
      }
      return inputIndex.toString();
    }

    // Handle direct Pure values
    if (arg && arg.$kind === 'Pure' && arg.Pure) {
      if (typeof arg.Pure === 'string') {
        return arg.Pure;
      }
      if (Array.isArray(arg.Pure) && arg.Pure.length > 0) {
        return arg.Pure.join('');
      }
    }

    if (arg && typeof arg === 'object') {
      if (arg.objectId) {
        return arg.objectId;
      }
      if (arg.Object && typeof arg.Object === 'string') {
        return arg.Object;
      }
      if (arg.Object && arg.Object.ImmOrOwned && typeof arg.Object.ImmOrOwned === 'string') {
        return arg.Object.ImmOrOwned;
      }
    }

    if (typeof arg === 'string') {
      return arg;
    }

    return String(arg);
  }

  private extractU64Value(arg: any): bigint {
    // Handle Input references
    if (arg && arg.$kind === 'Input' && typeof arg.Input === 'number') {
      const inputIndex = arg.Input;
      if (this.txInputs && this.txInputs[inputIndex]) {
        const input = this.txInputs[inputIndex];

        // Handle Pure type with base64 bytes
        if (input.$kind === 'Pure' && input.Pure && input.Pure.bytes) {
          // Decode base64 bytes to get the actual value
          const bytes = Buffer.from(input.Pure.bytes, 'base64');
          // Convert bytes to bigint (little-endian)
          let value = BigInt(0);
          for (let i = 0; i < bytes.length; i++) {
            // eslint-disable-next-line no-bitwise
            value += BigInt(bytes[i]) << BigInt(i * 8);
          }
          return value;
        }

        // Handle other input types
        if (input.type === 'pure' && input.value !== undefined) {
          return BigInt(input.value);
        }
        if (typeof input === 'number' || typeof input === 'string') {
          return BigInt(input);
        }
      }
      return BigInt(inputIndex);
    }

    // Handle direct Pure values
    if (arg && arg.$kind === 'Pure') {
      if (arg.Pure && typeof arg.Pure === 'string') {
        return BigInt(arg.Pure);
      }
      if (arg.Pure && typeof arg.Pure === 'number') {
        return BigInt(arg.Pure);
      }
      if (Array.isArray(arg.Pure)) {
        // Handle byte array representation
        // eslint-disable-next-line no-bitwise
        const value = arg.Pure.reduce(
          (acc: bigint, byte: number, index: number) => acc + (BigInt(byte) << BigInt(index * 8)),
          BigInt(0),
        );
        return value;
      }
      return BigInt(arg.Pure);
    }

    if (typeof arg === 'bigint') {
      return arg;
    }

    if (typeof arg === 'number' || typeof arg === 'string') {
      return BigInt(arg);
    }

    return BigInt(0);
  }
}
