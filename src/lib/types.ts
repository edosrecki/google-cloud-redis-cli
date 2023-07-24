import { GoogleCloudRedisInstance } from './gcloud/redis'

// configurations
export type Configuration = {
  configurationVersion?: number
  configurationName: string
  googleCloudProject: string
  googleCloudRedisInstance: GoogleCloudRedisInstance
  kubernetesContext: string
  kubernetesNamespace: string
  kubernetesSecret: string
  kubernetesSecretKey: string
  localPort: number
  googleCloudRedisPrintAuth?: boolean
}

export type ConfigurationCreateAnswers = Configuration & {
  confirmation: boolean
}

export type ConfigurationChooseAnswers = {
  configuration: Configuration
  googleCloudRedisAuth: boolean
  confirmation?: boolean
}

// secrets
export type SecretCreateAnswers = {
  googleCloudProject: string
  googleCloudRedisInstance: GoogleCloudRedisInstance
  kubernetesContext: string
  kubernetesNamespace: string
  kubernetesSecretName: string
  confirmation: boolean
}
