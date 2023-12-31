import Conf from 'conf'
import { Configuration } from '../types'

type Schema = {
  configurations: Configuration[]
}

export const currentConfigurationVersion = 2

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
          configurationVersion: { type: 'number' },
          configurationName: { type: 'string' },
          googleCloudProject: { type: 'string' },
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
          googleCloudRedisPrintAuth: { type: 'boolean' },
        },
      },
    },
  },
})

export type Store = typeof store
