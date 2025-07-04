import { TransactionSubTypes, TransactionType } from '@msafe/iota-utils';

import { CoinTransferIntention, CoinTransferIntentionData } from '@/apps/msafe-core/coin-transfer';
import { appHelpers } from '@/index';

import { Account, Client } from './config';

describe('MSafe Core Wallet', () => {
  it('Core transaction build', async () => {
    const appHelper = appHelpers.getAppHelper('msafe-core');

    expect(appHelper.application).toBe('msafe-core');

    const res = await appHelper.build({
      network: 'iota:testnet',
      txType: TransactionType.Assets,
      txSubType: TransactionSubTypes.assets.coin.send,
      client: Client,
      account: Account,
      intentionData: {
        amount: '1000',
        coinType: '0x2::iota::IOTA',
        recipient: '123',
      } as CoinTransferIntentionData,
    });
    expect(res.blockData.version).toBe(1);
    expect(res.blockData.sender).toBe('0x6ff423cb66243ef1fb02dff88aeed580362e2b28f59b92e10b81074b49bea4e1');
  });

  it('Test intention serialization', () => {
    const intention = CoinTransferIntention.fromData({
      recipient: 'a',
      coinType: 'b',
      amount: '100',
    });

    expect(intention.serialize()).toBe('{"amount":"100","coinType":"b","recipient":"a"}');
  });
});
