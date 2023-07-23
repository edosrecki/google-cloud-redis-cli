import { fetchGoogleCloudRedisCertificate } from '../gcloud/redis'
import { createKubernetesSecret } from '../kubectl/secrets'
import { SecretCreateAnswers } from '../types'

export const saveSecret = ({
  googleCloudProject,
  googleCloudRedisInstance,
  kubernetesContext,
  kubernetesNamespace,
  kubernetesSecretName,
}: SecretCreateAnswers): void => {
  const { region, name: instanceName } = googleCloudRedisInstance

  const certificate = fetchGoogleCloudRedisCertificate(
    googleCloudProject,
    region,
    instanceName
  )
  createKubernetesSecret(
    kubernetesContext,
    kubernetesNamespace,
    kubernetesSecretName,
    certificate
  )
}
