import { normalizeStructTag } from '@iota/iota-sdk/utils';
import { COIN, COIN_TYPES } from '@virtue/sdk';

import {
  ManagePositionIntentionData,
  DepositStabilityPoolIntentionData,
  WithdrawStabilityPoolIntentionData,
} from '@/apps/virtue/types/api';

export type VirtueIntentionData =
  | ManagePositionIntentionData
  | DepositStabilityPoolIntentionData
  | WithdrawStabilityPoolIntentionData;

/// return empty string when not-found
export const getCoinSymbolByType = (coinType: string) => {
  const normalizaedCoinType = normalizeStructTag(coinType);

  const matchedCoinSymbol = Object.keys(COIN_TYPES).find((coin) => COIN_TYPES[coin as COIN] === normalizaedCoinType);

  return matchedCoinSymbol || '';
};
