import { CetusHelper } from '@/apps/cetus/helper';
import { MPayAppHelper } from '@/apps/mpay/helper';
import { CoreHelper } from '@/apps/msafe-core/helper';
import { NAVIAppHelper } from '@/apps/navi/helper';
import { PlainTransactionHelper } from '@/apps/plain-transaction/helper';
import { MSafeApps } from '@/apps/registry';
import { ScallopAppHelper } from '@/apps/scallop/helper';
import { TURBOSAppHelper } from '@/apps/turbos/helper';
import { VoloAppHelper } from '@/apps/volo/helper';
import { KRIYAAppHelper } from './apps/kriya/helper';

export const appHelpers = new MSafeApps([
  new CoreHelper(),
  new NAVIAppHelper(),
  new MPayAppHelper(),
  new PlainTransactionHelper(),
  new CetusHelper(),
  new TURBOSAppHelper(),
  new KRIYAAppHelper(),
  new ScallopAppHelper(),
  new VoloAppHelper(),
]);
