import Conf from 'conf'
import { Configuration } from '../types'

type Schema = {
  configurations: Configuration[]
}

export const store = new Conf<Schema>({
  configName: 'configurations',
  projectSuffix: '',
  schema: {
    configurations: {
      type: 'array',
      default: [],
      items: {
        type: 'object',
        properties: {
          configurationName: { type: 'string' },
          googleCloudRedisInstance: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              region: { type: 'string' },
              host: { type: 'string' },
              port: { type: 'string' },
            },
          },
          kubernetesContext: { type: 'string' },
          kubernetesNamespace: { type: 'string' },
          kubernetesSecret: { type: 'string' },
          kubernetesSecretKey: { type: 'string' },
          localPort: { type: 'number' },
        },
      },
    },
  },
})

export type Store = typeof store
