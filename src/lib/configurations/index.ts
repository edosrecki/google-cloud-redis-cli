import exitHook from 'exit-hook'
import { omit, kebabCase } from 'lodash'
import {
  deletePod,
  portForward,
  runCloudRedisProxyPod,
  waitForPodReady,
} from '../kubectl/pods'
import { Configuration, ConfigurationCreateAnswers } from '../types'
import { appendOrReplaceByKey, deleteByKey, findByKey } from '../util/array'
import { randomString } from '../util/string'
import { store } from './store'

const storeKey = 'configurations' as const
const searchKey = 'configurationName' as const
const excludeProperties = ['googleCloudProject', 'confirmation'] as const

export const configurationPath = store.path

export const getConfigurations = (): Configuration[] => store.get(storeKey)

export const getConfiguration = (name: string): Configuration | undefined => {
  const configurations = getConfigurations()
  return findByKey(configurations, searchKey, name)
}

export const saveConfiguration = (answers: ConfigurationCreateAnswers): void => {
  const configuration = omit(answers, excludeProperties)

  const configurations = store.get(storeKey)
  appendOrReplaceByKey(configurations, configuration, searchKey)
  store.set(storeKey, configurations)
}

export const deleteConfiguration = (configuratioName: string): void => {
  const configurations = store.get(storeKey)
  deleteByKey(configurations, searchKey, configuratioName)
  store.set(storeKey, configurations)
}

export const execConfiguration = (configuration: Configuration) => {
  const pod = {
    name: `redis-proxy-${kebabCase(configuration.configurationName)}-${randomString()}`,
    context: configuration.kubernetesContext,
    namespace: configuration.kubernetesNamespace,
    secret: configuration.kubernetesSecret,
    secretKey: configuration.kubernetesSecretKey,
    localPort: configuration.localPort,
    remoteHost: configuration.googleCloudRedisInstance.host,
    remotePort: configuration.googleCloudRedisInstance.port,
  }

  exitHook(() => {
    deletePod(pod)
  })

  runCloudRedisProxyPod(pod)
  waitForPodReady(pod)
  portForward(pod)
}