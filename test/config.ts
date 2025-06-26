import { IotaClient } from '@iota/iota-sdk/client';
import { fromHEX } from '@iota/iota-sdk/utils';
import { SUPPORTED_CHAINS, WalletAccount } from '@iota/wallet-standard';
console.log('🚀 ~ SUPPORTED_CHAINS:', SUPPORTED_CHAINS);

export const Client = new IotaClient({ url: 'https://api.iota-rebased-alphanet.iota.cafe' });
export const Account: WalletAccount = {
  address: '0x6ff423cb66243ef1fb02dff88aeed580362e2b28f59b92e10b81074b49bea4e1',
  publicKey: fromHEX('0x6ff423cb66243ef1fb02dff88aeed580362e2b28f59b92e10b81074b49bea4e1'),
  chains: [],
  features: [],
};
