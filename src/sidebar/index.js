import simulator from './simulator';
import uploadInit from './upload';
import debugInit from './debug';

function init({ context }) {
  const upload = uploadInit(context.proxy);
  const debug = debugInit(context.proxy);

  return { simulator, upload, debug };
}

export default init;
