import { GoogleCloudRedisInstance } from './gcloud/redis'

// configurations
export type Configuration = {
  configurationName: string
  googleCloudRedisInstance: GoogleCloudRedisInstance
  kubernetesContext: string
  kubernetesNamespace: string
  kubernetesSecret: string
  kubernetesSecretKey: string
  localPort: number
}

export type ConfigurationCreateAnswers = Configuration & {
  googleCloudProject: string
  confirmation: boolean
}

export type ConfigurationChooseAnswers = {
  configuration: Configuration
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
