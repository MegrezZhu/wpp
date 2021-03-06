import { createCore } from '../../lib/createCore';

export default async function () {
  const core = await createCore();
  await core.runOnce();
}
