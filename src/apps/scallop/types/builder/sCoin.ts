import { Transaction, TransactionResult } from '@mysten/sui.js/transactions';

import { ScallopBuilder } from '../../models';
import { SupportSCoin } from '../constant';
import { SuiObjectArg } from '../utils';

export type SCoinPkgIds = {
  pkgId: string;
};
export type sCoinTreasuryIds = {
  [k in SupportSCoin]?: string;
};

export type SCoinNormalMethods = {
  /**
   * Lock marketCoin and return sCoin
   * @param marketCoinName
   * @param marketCoin
   * @returns
   */
  mintSCoin: (marketCoinName: SupportSCoin, marketCoin: SuiObjectArg) => TransactionResult;
  /**
   * Burn sCoin and return marketCoin
   * @param sCoinName
   * @param sCoin
   * @returns
   */
  burnSCoin: (sCoinName: SupportSCoin, sCoin: SuiObjectArg) => TransactionResult; // returns marketCoin
};

export type SCoinQuickMethods = {
  mintSCoinQuick: (marketCoinName: SupportSCoin, amount: number, walletAddress: string) => Promise<TransactionResult>;
  burnSCoinQuick: (sCoinName: SupportSCoin, amount: number, walletAddress: string) => Promise<TransactionResult>;
};

export type SuiTxBlockWithSCoinNormalMethods = Transaction & SCoinNormalMethods;
export type SCoinTxBlock = SuiTxBlockWithSCoinNormalMethods & SCoinQuickMethods;

export type GenerateSCoinNormalMethod = (params: {
  builder: ScallopBuilder;
  txBlock: Transaction;
}) => Promise<SCoinNormalMethods>;

export type GenerateSCoinQuickMethod = (params: {
  builder: ScallopBuilder;
  txBlock: SuiTxBlockWithSCoinNormalMethods;
}) => Promise<SCoinQuickMethods>;
