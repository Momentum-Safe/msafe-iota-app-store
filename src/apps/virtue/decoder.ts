import { bcs } from '@iota/iota-sdk/bcs';
import { IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { IotaSignTransactionInput, WalletAccount } from '@iota/wallet-standard';
import { TransactionType } from '@msafe/iota-utils';
import { Logger, ILogObj } from 'tslog';

import { IotaNetworks } from '@/types';

import { DecodeResult, TransactionSubType } from './types';
import {
  DepositStabilityPoolIntentionData,
  ManagePositionIntentionData,
  WithdrawStabilityPoolIntentionData,
} from './types/api';
import { getCoinSymbolByType } from './types/helper';

const logger = new Logger<ILogObj>({
  name: 'Virtue',
});

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

    this.transaction = tx;

    if (this.isManagePositionTransaction()) {
      return this.decodeManagePosition();
    }

    if (this.isDepositStabilityPoolTransaction()) {
      return this.depositStabilityPool();
    }

    if (this.isWithdrawStabilityPoolTransaction()) {
      return this.withdrawStabilityPool();
    }

    logger.info({ commands: this.commands });

    throw new Error(`Unknown transaction type`);
  }

  // Store transaction inputs for value extractionAdd commentMore actions
  private transaction: Transaction;

  private txInputs: any[] = [];

  private txData: any;

  private getRequestAccountCommand() {
    return (
      this.getMoveCallModuleCommand('account', 'request') ||
      this.getMoveCallModuleCommand('account', 'request_with_account') ||
      null
    );
  }

  // validate function by checking function signature
  private isManagePositionTransaction() {
    return (
      // create account when first time deposit
      (!!this.getMoveCallModuleCommand('account', 'request') ||
        // re-use account
        !!this.getMoveCallModuleCommand('account', 'request_with_account')) &&
      !!this.getMoveCallModuleCommand('vault', 'update_position')
    );
  }

  private isDepositStabilityPoolTransaction() {
    // TODO: typo
    return (
      !!this.getMoveCallModuleCommand('stability_pool', 'deposit') &&
      !this.getMoveCallModuleCommand('stability_pool', 'withdraw')
    );
  }

  private isWithdrawStabilityPoolTransaction() {
    // TODO: typo
    return (
      !!this.getMoveCallModuleCommand('stability_pool', 'withdraw') &&
      !!this.getMoveCallModuleCommand('stability_pool', 'withdraw')
    );
  }

  // utils functions
  private get inputs() {
    return this.transaction.getData().inputs;
  }

  private get commands() {
    return this.transaction.getData().commands.map((c, index) => ({ ...c, index }));
  }

  private getMoveCallCommand(fn: string) {
    return this.commands.find((command) => command.$kind === 'MoveCall' && command.MoveCall.function === fn);
  }

  private getSplitCoinsCommands() {
    return this.commands.filter((command) => command.$kind === 'SplitCoins');
  }

  private GetTransferObjectsCommands() {
    return this.commands.filter((command) => command.$kind === 'TransferObjects');
  }

  private getZeroCoinsCommands() {
    return this.commands.filter(
      (command) =>
        command.$kind === 'MoveCall' && command.MoveCall.module === 'coin' && command.MoveCall.function === 'zero',
    );
  }

  private getMoveCallModuleCommand(module: string, fn: string) {
    return this.commands.find(
      (command) =>
        command.$kind === 'MoveCall' && command.MoveCall.module === module && command.MoveCall.function === fn,
    );
  }

  private getPureInputU64(idx: number) {
    const input = this.inputs[idx];
    if (input.$kind !== 'Pure') {
      throw new Error('not pure argument');
    }

    return bcs.U64.fromBase64(input.Pure.bytes);
  }

  private getPureInputAddress(idx: number) {
    const input = this.inputs[idx];
    if (input.$kind !== 'Pure') {
      throw new Error('not pure argument');
    }

    return bcs.Address.fromBase64(input.Pure.bytes);
  }

  // decode transactions
  private decodeManagePosition(): DecodeResult {
    const intentionData = {
      collateralSymbol: '',
      depositAmount: '',
      borrowAmount: '',
      repaymentAmount: '',
      withdrawAmount: '',
      accountObjId: '',
      recipient: '',
    } as Omit<ManagePositionIntentionData, 'collateralSymbol'> & { collateralSymbol: string };

    // accountObjId
    const requestAccountCommand = this.getRequestAccountCommand();
    if (!requestAccountCommand) {
      throw Error('requestAccountCommand not found');
    }
    if (requestAccountCommand.MoveCall.function === 'request') {
      // account::request
      intentionData.accountObjId = undefined;
    } else {
      // account::request_with_account
      const argument = requestAccountCommand.MoveCall.arguments[0];
      if (argument.$kind === 'Input') {
        if (argument.type === 'object') {
          intentionData.accountObjId = (argument as any).value;
        }
      }
    }
    // depositAmount & repaymentAmount
    // we use the order of collectorNewCommand to deduct which commands related to depositAmount & repaymentAmount
    const collectorNewCommand = this.getMoveCallModuleCommand('collector', 'new');
    const getComparedCommand = () => {
      if (!collectorNewCommand) {
        return requestAccountCommand;
      }
      return requestAccountCommand.index < collectorNewCommand.index ? requestAccountCommand : collectorNewCommand;
    };
    const comparedCommand = getComparedCommand();
    const splitCoinsCommands = this.getSplitCoinsCommands().filter((c) => c.index < comparedCommand.index);
    const zeroCoinsCommands = this.getZeroCoinsCommands().filter((c) => c.index < comparedCommand.index);

    // check if we only handle 2 coin assets
    if (splitCoinsCommands.length + zeroCoinsCommands.length !== 2) {
      throw Error('Unhandled Transaction');
    }

    // find "collateralAmount & repaymentAmount" from getInputCoin command
    // both coins come from SplitCoins
    if (splitCoinsCommands.length === 2) {
      const sortedSplitCoinsCommands = splitCoinsCommands.sort((a, b) => a.index - b.index);
      if (sortedSplitCoinsCommands[0].$kind === 'SplitCoins') {
        const inputCoinObject = sortedSplitCoinsCommands[0].SplitCoins.amounts[0];
        if (inputCoinObject.$kind === 'Input') {
          intentionData.depositAmount = this.getPureInputU64(inputCoinObject.Input);
        }
      }

      if (sortedSplitCoinsCommands[1].$kind === 'SplitCoins') {
        const inputCoinObject = sortedSplitCoinsCommands[1].SplitCoins.amounts[0];
        if (inputCoinObject.$kind === 'Input') {
          intentionData.repaymentAmount = this.getPureInputU64(inputCoinObject.Input);
        }
      }
    } else if (zeroCoinsCommands.length === 2) {
      // both coins come from coinZero command
      const sortedZeroCommands = zeroCoinsCommands.sort((a, b) => a.index - b.index);
      if (sortedZeroCommands[0].$kind === 'MoveCall') {
        if (sortedZeroCommands[0].MoveCall.module === 'coin' && sortedZeroCommands[0].MoveCall.function === 'zero') {
          intentionData.depositAmount = '0';
        }
      }

      if (sortedZeroCommands[1].$kind === 'MoveCall') {
        if (sortedZeroCommands[1].MoveCall.module === 'coin' && sortedZeroCommands[1].MoveCall.function === 'zero') {
          intentionData.repaymentAmount = '0';
        }
      }
    } else {
      // when we have single zeroCoinsCommands & splitCoinsCommands respectively
      const zeroCoinsCommand = zeroCoinsCommands[0];
      const splitCoinsCommand = splitCoinsCommands[0];

      if (zeroCoinsCommand.index < splitCoinsCommand.index) {
        // [collateralAmount, repaymentAmount] = [zeroCoinsCommand, splitCoinsCommand]
        // collateralAmount
        if (
          zeroCoinsCommand.$kind === 'MoveCall' &&
          zeroCoinsCommand.MoveCall.module === 'coin' &&
          zeroCoinsCommand.MoveCall.function === 'zero'
        ) {
          intentionData.depositAmount = '0';
        }
        // repaymentAmount
        if (splitCoinsCommand.$kind === 'SplitCoins') {
          const repaymentAmount = splitCoinsCommand.SplitCoins.amounts[0];
          if (repaymentAmount.$kind === 'Input') {
            intentionData.repaymentAmount = this.getPureInputU64(repaymentAmount.Input);
          }
        }
      } else {
        // [collateralAmount, repaymentAmount] = [splitCoinsCommand, zeroCoinsCommand]
        // collateralAmount
        if (splitCoinsCommand.$kind === 'SplitCoins') {
          const collateralAmount = splitCoinsCommand.SplitCoins.amounts[0];
          if (collateralAmount.$kind === 'Input') {
            intentionData.depositAmount = this.getPureInputU64(collateralAmount.Input);
          }
        }
        // repaymentAmount
        if (
          zeroCoinsCommand.$kind === 'MoveCall' &&
          zeroCoinsCommand.MoveCall.module === 'coin' &&
          zeroCoinsCommand.MoveCall.function === 'zero'
        ) {
          intentionData.repaymentAmount = '0';
        }
      }
    }

    const debtorRequestCommand = this.getMoveCallModuleCommand('request', 'debtor_request');
    // collateralSymbol
    const collateralType = debtorRequestCommand.MoveCall.typeArguments[0];
    intentionData.collateralSymbol = getCoinSymbolByType(collateralType);

    // borrowAmount
    const borrowAmountArgument = debtorRequestCommand.MoveCall.arguments[4];
    if (borrowAmountArgument.$kind === 'Input') {
      intentionData.borrowAmount = this.getPureInputU64(borrowAmountArgument.Input);
    }
    // withdrawAmount
    const withdrawAmountArgument = debtorRequestCommand.MoveCall.arguments[6];
    if (withdrawAmountArgument.$kind === 'Input') {
      intentionData.withdrawAmount = this.getPureInputU64(withdrawAmountArgument.Input);
    }

    if (!intentionData.collateralSymbol) {
      throw Error(`collateralSymbol: ${intentionData.collateralSymbol} is not defined`);
    }

    return {
      txType: TransactionType.Other,
      type: TransactionSubType.ManagePosition,
      intentionData,
    };
  }

  private depositStabilityPool(): DecodeResult {
    const intentionData = {
      depositAmount: '',
    } as DepositStabilityPoolIntentionData;

    const splitCoinsCommands = this.getSplitCoinsCommands();

    if (splitCoinsCommands.length !== 1) {
      throw Error('Unhandled transaction');
    }

    // vusdAmount
    const splitCoinsCommand = splitCoinsCommands[0];
    if (splitCoinsCommand.$kind === 'SplitCoins') {
      const vusdAmount = splitCoinsCommand.SplitCoins.amounts[0];
      if (vusdAmount.$kind === 'Input') {
        intentionData.depositAmount = this.getPureInputU64(vusdAmount.Input);
      }
    }

    // recipient
    const stabilityPoolDepositCommand = this.getMoveCallModuleCommand('stability_pool', 'deposit');

    const recipientArgument = stabilityPoolDepositCommand.MoveCall.arguments[2];
    if (recipientArgument.$kind === 'Input' && recipientArgument.type === 'pure') {
      intentionData.recipient = this.getPureInputAddress(recipientArgument.Input);
    }

    return {
      txType: TransactionType.Other,
      type: TransactionSubType.DepositStabilityPool,
      intentionData,
    };
  }

  private withdrawStabilityPool(): DecodeResult {
    const intentionData = {
      withdrawAmount: '',
    } as WithdrawStabilityPoolIntentionData;

    const stabilityPoolWithdrawCommand = this.getMoveCallModuleCommand('stability_pool', 'withdraw');
    const amountArgument = stabilityPoolWithdrawCommand.MoveCall.arguments[3];
    if (amountArgument.$kind === 'Input') {
      intentionData.withdrawAmount = this.getPureInputU64(amountArgument.Input);
    }

    // recipient
    const requestAccountCommand = this.getRequestAccountCommand();
    if (!requestAccountCommand) {
      throw Error('requestAccountCommand not found');
    }
    if (requestAccountCommand.MoveCall.function === 'request') {
      // account::request
      intentionData.accountObj = undefined;
    } else {
      // account::request_with_account
      const argument = requestAccountCommand.MoveCall.arguments[0];
      if (argument.$kind === 'Input') {
        if (argument.type === 'object') {
          intentionData.accountObj = (argument as any).value;
        }
      }
    }

    return {
      txType: TransactionType.Other,
      type: TransactionSubType.WithdrawStabilityPool,
      intentionData,
    };
  }
}
