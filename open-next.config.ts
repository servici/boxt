import type { OpenNextConfig } from '@opennextjs/aws/types/open-next';

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare-node',
      converter: 'edge',
      incrementalCache: 'dummy',
      tagCache: 'dummy',
      queue: 'dummy',
    },
  },
  dangerous: {
    enableDangerouslyUseUnsupportedNextVersion: true,
  },
};

export default config;
