import { run } from '../cli/handlers';
import '../core/globalErrorHandling';
import { loadSetting } from '../lib/tools';

(async () => {
  await loadSetting();
  run();
})();
