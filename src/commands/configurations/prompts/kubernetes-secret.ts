import { fetchKubernetesSecrets } from '../../../lib/kubectl/secrets'
import { ConfigurationCreateAnswers } from '../../../lib/types'
import { search } from '../../../lib/util/search'
import { tryCatch } from '../../../lib/util/error'

const source = tryCatch((answers: ConfigurationCreateAnswers, input?: string) => {
  const secrets = fetchKubernetesSecrets(
    answers.kubernetesContext,
    answers.kubernetesNamespace
  )
  return search(secrets, input)
})

export const kubernetesSecretPrompt = {
  type: 'autocomplete',
  name: 'kubernetesSecret',
  message: 'Choose Kubernetes secret containing Redis certificate:',
  source,
}
