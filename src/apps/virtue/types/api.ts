import { VirtueClient } from '@virtue/sdk';

export type ManagePositionIntentionData = Parameters<VirtueClient['buildManagePositionTransaction']>[0];

export type DepositStabilityPoolIntentionData = Parameters<VirtueClient['buildDepositStabilityPoolTransaction']>[0];

export type WithdrawStabilityPoolIntentionData = Parameters<VirtueClient['buildWithdrawStabilityPoolTransaction']>[0];
