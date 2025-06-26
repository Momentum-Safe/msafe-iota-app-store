import { getFullnodeUrl, IotaClient } from '@iota/iota-sdk/client';
import { Transaction } from '@iota/iota-sdk/transactions';
import { IotaSignTransactionInput, WalletAccount } from '@iota/wallet-standard';
import { HexToUint8Array } from '@msafe/iota-utils';
import { COIN_DECIMALS, COLLATERAL_COIN } from '@virtue/sdk';

import { getVirtueClient } from '@/apps/virtue/api/config';
import { Decoder } from '@/apps/virtue/decoder';
import {
  DepositStabilityPoolIntentionData,
  ManagePositionIntentionData,
  WithdrawStabilityPoolIntentionData,
} from '@/apps/virtue/types/api';
import { IotaNetworks } from '@/types';

import { Logger, ILogObj } from 'tslog';

const logger = new Logger<ILogObj>({
  name: 'Virtue',
});

describe('Virtue App', () => {
  const testWallet: WalletAccount = {
    // make sure wallet address has enough token to simulate the below test scenarios
    address: '0x6ff423cb66243ef1fb02dff88aeed580362e2b28f59b92e10b81074b49bea4e1',
    publicKey: HexToUint8Array('0x6ff423cb66243ef1fb02dff88aeed580362e2b28f59b92e10b81074b49bea4e1'),
    chains: ['iota:mainnet'],
    features: [],
  };
  const network: IotaNetworks = 'iota:mainnet';
  const virtueClient = getVirtueClient(network, testWallet);
  const iotaClient = new IotaClient({ url: getFullnodeUrl('mainnet') });

  function getDecoder(tx: Transaction) {
    const input = {
      network,
      client: iotaClient,
      account: testWallet,
      transaction: tx,
      chain: network,
    } as IotaSignTransactionInput & {
      network: IotaNetworks;
      client: IotaClient;
      account: WalletAccount;
    };
    return new Decoder(input);
  }

  // --- Position ---
  it('Test open position with IOTA collateral', async () => {
    const collateralSymbol: COLLATERAL_COIN = 'IOTA';
    const depositAmount = (10 ** COIN_DECIMALS.IOTA).toString();
    const borrowAmount = (10 ** COIN_DECIMALS.VUSD).toString();
    const repaymentAmount = (0).toString();
    const withdrawAmount = (0).toString();

    const tx = await virtueClient.buildManagePositionTransaction({
      collateralSymbol,
      depositAmount,
      borrowAmount,
      repaymentAmount,
      withdrawAmount,
      accountObjId: undefined,
    });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('manage-position');
    const intentionData = result.intentionData as ManagePositionIntentionData;
    expect(intentionData.collateralSymbol).toBe('IOTA');
    expect(intentionData.depositAmount).toBe(depositAmount);
    expect(intentionData.borrowAmount).toBe(borrowAmount);
    expect(intentionData.repaymentAmount).toBe(repaymentAmount);
    expect(intentionData.withdrawAmount).toBe(withdrawAmount);
  });

  it('Test position deposit with IOTA collateral', async () => {
    const collateralSymbol: COLLATERAL_COIN = 'IOTA';
    const depositAmount = (10 ** COIN_DECIMALS.IOTA).toString();
    const borrowAmount = (0).toString();
    const repaymentAmount = (0).toString();
    const withdrawAmount = (0).toString();

    const tx = await virtueClient.buildManagePositionTransaction({
      collateralSymbol,
      depositAmount,
      borrowAmount,
      repaymentAmount,
      withdrawAmount,
      accountObjId: undefined,
    });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('manage-position');
    const intentionData = result.intentionData as ManagePositionIntentionData;
    expect(intentionData.collateralSymbol).toBe(collateralSymbol);
    expect(intentionData.depositAmount).toBe(depositAmount);
    expect(intentionData.borrowAmount).toBe(borrowAmount);
    expect(intentionData.repaymentAmount).toBe(repaymentAmount);
    expect(intentionData.withdrawAmount).toBe(withdrawAmount);
  });

  it('Test position borrow with IOTA collateral', async () => {
    const collateralSymbol: COLLATERAL_COIN = 'IOTA';
    const depositAmount = (0).toString();
    const borrowAmount = (10 ** COIN_DECIMALS.VUSD).toString();
    const repaymentAmount = (0).toString();
    const withdrawAmount = (0).toString();

    const tx = await virtueClient.buildManagePositionTransaction({
      collateralSymbol,
      depositAmount,
      borrowAmount,
      repaymentAmount,
      withdrawAmount,
      accountObjId: undefined,
    });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('manage-position');
    const intentionData = result.intentionData as ManagePositionIntentionData;
    expect(intentionData.collateralSymbol).toBe(collateralSymbol);
    expect(intentionData.depositAmount).toBe(depositAmount);
    expect(intentionData.borrowAmount).toBe(borrowAmount);
    expect(intentionData.repaymentAmount).toBe(repaymentAmount);
    expect(intentionData.withdrawAmount).toBe(withdrawAmount);
  });

  it('Test position withdraw with IOTA collateral', async () => {
    const collateralSymbol: COLLATERAL_COIN = 'IOTA';
    const depositAmount = (0).toString();
    const borrowAmount = (0).toString();
    const repaymentAmount = (0).toString();
    const withdrawAmount = (10 ** COIN_DECIMALS.IOTA).toString();

    const tx = await virtueClient.buildManagePositionTransaction({
      collateralSymbol,
      depositAmount,
      borrowAmount,
      repaymentAmount,
      withdrawAmount,
      accountObjId: undefined,
    });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('manage-position');
    const intentionData = result.intentionData as ManagePositionIntentionData;
    expect(intentionData.collateralSymbol).toBe(collateralSymbol);
    expect(intentionData.depositAmount).toBe(depositAmount);
    expect(intentionData.borrowAmount).toBe(borrowAmount);
    expect(intentionData.repaymentAmount).toBe(repaymentAmount);
    expect(intentionData.withdrawAmount).toBe(withdrawAmount);
  });

  it('Test position repay with IOTA collateral', async () => {
    const collateralSymbol: COLLATERAL_COIN = 'IOTA';
    const depositAmount = (0 * 10 ** COIN_DECIMALS.IOTA).toString();
    const borrowAmount = (0).toString();
    const repaymentAmount = (0.03 * 10 ** COIN_DECIMALS.VUSD).toString();
    const withdrawAmount = (0).toString();

    const tx = await virtueClient.buildManagePositionTransaction({
      collateralSymbol,
      depositAmount,
      borrowAmount,
      repaymentAmount,
      withdrawAmount,
      accountObjId: undefined,
    });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('manage-position');
    const intentionData = result.intentionData as ManagePositionIntentionData;
    expect(intentionData.collateralSymbol).toBe(collateralSymbol);
    expect(intentionData.depositAmount).toBe(depositAmount);
    expect(intentionData.borrowAmount).toBe(borrowAmount);
    expect(intentionData.repaymentAmount).toBe(repaymentAmount);
    expect(intentionData.withdrawAmount).toBe(withdrawAmount);
  });
  // stIOTA
  it('Test open position with stIOTA collateral', async () => {
    const collateralSymbol: COLLATERAL_COIN = 'stIOTA';
    const depositAmount = (10 ** COIN_DECIMALS.stIOTA).toString();
    const borrowAmount = (10 ** COIN_DECIMALS.VUSD).toString();
    const repaymentAmount = (0).toString();
    const withdrawAmount = (0).toString();

    const tx = await virtueClient.buildManagePositionTransaction({
      collateralSymbol,
      depositAmount,
      borrowAmount,
      repaymentAmount,
      withdrawAmount,
      accountObjId: undefined,
    });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('manage-position');
    const intentionData = result.intentionData as ManagePositionIntentionData;
    expect(intentionData.collateralSymbol).toBe('stIOTA');
    expect(intentionData.depositAmount).toBe(depositAmount);
    expect(intentionData.borrowAmount).toBe(borrowAmount);
    expect(intentionData.repaymentAmount).toBe(repaymentAmount);
    expect(intentionData.withdrawAmount).toBe(withdrawAmount);
  });

  it('Test position deposit with stIOTA collateral', async () => {
    const collateralSymbol: COLLATERAL_COIN = 'stIOTA';
    const depositAmount = (10 ** COIN_DECIMALS.stIOTA).toString();
    const borrowAmount = (0).toString();
    const repaymentAmount = (0).toString();
    const withdrawAmount = (0).toString();

    const tx = await virtueClient.buildManagePositionTransaction({
      collateralSymbol,
      depositAmount,
      borrowAmount,
      repaymentAmount,
      withdrawAmount,
      accountObjId: undefined,
    });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('manage-position');
    const intentionData = result.intentionData as ManagePositionIntentionData;
    expect(intentionData.collateralSymbol).toBe(collateralSymbol);
    expect(intentionData.depositAmount).toBe(depositAmount);
    expect(intentionData.borrowAmount).toBe(borrowAmount);
    expect(intentionData.repaymentAmount).toBe(repaymentAmount);
    expect(intentionData.withdrawAmount).toBe(withdrawAmount);
  });

  it('Test position borrow with stIOTA collateral', async () => {
    const collateralSymbol: COLLATERAL_COIN = 'stIOTA';
    const depositAmount = (0).toString();
    const borrowAmount = (10 ** COIN_DECIMALS.VUSD).toString();
    const repaymentAmount = (0).toString();
    const withdrawAmount = (0).toString();

    const tx = await virtueClient.buildManagePositionTransaction({
      collateralSymbol,
      depositAmount,
      borrowAmount,
      repaymentAmount,
      withdrawAmount,
      accountObjId: undefined,
    });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('manage-position');
    const intentionData = result.intentionData as ManagePositionIntentionData;
    expect(intentionData.collateralSymbol).toBe(collateralSymbol);
    expect(intentionData.depositAmount).toBe(depositAmount);
    expect(intentionData.borrowAmount).toBe(borrowAmount);
    expect(intentionData.repaymentAmount).toBe(repaymentAmount);
    expect(intentionData.withdrawAmount).toBe(withdrawAmount);
  });

  it('Test position withdraw with stIOTA collateral', async () => {
    const collateralSymbol: COLLATERAL_COIN = 'stIOTA';
    const depositAmount = (0).toString();
    const borrowAmount = (0).toString();
    const repaymentAmount = (0).toString();
    const withdrawAmount = (10 ** COIN_DECIMALS.stIOTA).toString();

    const tx = await virtueClient.buildManagePositionTransaction({
      collateralSymbol,
      depositAmount,
      borrowAmount,
      repaymentAmount,
      withdrawAmount,
      accountObjId: undefined,
    });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('manage-position');
    const intentionData = result.intentionData as ManagePositionIntentionData;
    expect(intentionData.collateralSymbol).toBe(collateralSymbol);
    expect(intentionData.depositAmount).toBe(depositAmount);
    expect(intentionData.borrowAmount).toBe(borrowAmount);
    expect(intentionData.repaymentAmount).toBe(repaymentAmount);
    expect(intentionData.withdrawAmount).toBe(withdrawAmount);
  });

  it('Test position repay with stIOTA collateral', async () => {
    const collateralSymbol: COLLATERAL_COIN = 'stIOTA';
    const depositAmount = (0 * 10 ** COIN_DECIMALS.stIOTA).toString();
    const borrowAmount = (0).toString();
    const repaymentAmount = (0.03 * 10 ** COIN_DECIMALS.VUSD).toString();
    const withdrawAmount = (0).toString();

    const tx = await virtueClient.buildManagePositionTransaction({
      collateralSymbol,
      depositAmount,
      borrowAmount,
      repaymentAmount,
      withdrawAmount,
      accountObjId: undefined,
    });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('manage-position');
    const intentionData = result.intentionData as ManagePositionIntentionData;
    expect(intentionData.collateralSymbol).toBe(collateralSymbol);
    expect(intentionData.depositAmount).toBe(depositAmount);
    expect(intentionData.borrowAmount).toBe(borrowAmount);
    expect(intentionData.repaymentAmount).toBe(repaymentAmount);
    expect(intentionData.withdrawAmount).toBe(withdrawAmount);
  });

  // --- Tank ---
  it('Test deposit stability pool', async () => {
    const depositAmount = (10 ** 9).toString();

    const tx = await virtueClient.buildDepositStabilityPoolTransaction({
      depositAmount,
    });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('deposit-stability-pool');
    const intentionData = result.intentionData as DepositStabilityPoolIntentionData;
    expect(intentionData.depositAmount).toBe(depositAmount);
  });

  it('Test withdraw stability pool', async () => {
    const withdrawAmount = (10 ** 6).toString();

    const tx = await virtueClient.buildWithdrawStabilityPoolTransaction({ withdrawAmount });

    const decoder = getDecoder(tx);
    const result = await decoder.decode();

    expect(result.type).toBe('withdraw-stability-pool');
    const intentionData = result.intentionData as WithdrawStabilityPoolIntentionData;
    expect(intentionData.withdrawAmount).toBe(withdrawAmount);
  });
});
