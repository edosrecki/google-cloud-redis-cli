import boxen from 'boxen'
import { blue } from 'chalk'
import exitHook from 'exit-hook'
import { kebabCase, omit } from 'lodash'
import { printGoogleCloudRedisAuthString } from '../gcloud/redis'
import {
  deletePod,
  portForward,
  runCloudRedisProxyPod,
  waitForPodReady,
} from '../kubectl/pods'
import { Configuration, ConfigurationCreateAnswers } from '../types'
import { appendOrReplaceByKey, deleteByKey, findByKey } from '../util/array'
import { randomString } from '../util/string'
import { currentConfigurationVersion, store } from './store'

const storeKey = 'configurations' as const
const searchKey = 'configurationName' as const
const excludeProperties = ['confirmation'] as const

export const configurationPath = store.path

export const getConfigurations = (): Configuration[] => store.get(storeKey)

export const getConfiguration = (name: string): Configuration | undefined => {
  const configurations = getConfigurations()
  return findByKey(configurations, searchKey, name)
}

export const saveConfiguration = (answers: ConfigurationCreateAnswers): void => {
  const configuration = {
    configurationVersion: currentConfigurationVersion,
    ...omit(answers, excludeProperties),
  }

  const configurations = store.get(storeKey)
  appendOrReplaceByKey(configurations, configuration, searchKey)
  store.set(storeKey, configurations)
}

export const deleteConfiguration = (configuratioName: string): void => {
  const configurations = store.get(storeKey)
  deleteByKey(configurations, searchKey, configuratioName)
  store.set(storeKey, configurations)
}

const checkConfigurationVersion = ({ configurationVersion }: Configuration): void => {
  if (configurationVersion && configurationVersion >= currentConfigurationVersion) {
    return
  }

  const text =
    `Your configuration was created with older version of the app.\n` +
    `Recreate it to use latest features:\n\n` +
    `> ${blue('google-cloud-redis')} configurations create`

  const box = boxen(text, {
    title: 'Warning',
    titleAlignment: 'center',
    borderColor: 'yellow',
    margin: { top: 1, right: 0, bottom: 1, left: 0 },
    padding: { top: 0, right: 1, bottom: 0, left: 1 },
  })

  console.log(box)
}

export const execConfiguration = (configuration: Configuration) => {
  checkConfigurationVersion(configuration)

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
  printGoogleCloudRedisAuthString(configuration)
  portForward(pod)
}
