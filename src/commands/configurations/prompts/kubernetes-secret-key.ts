import { fetchKubernetesSecretKeys } from '../../../lib/kubectl/secret-keys'
import { ConfigurationCreateAnswers } from '../../../lib/types'
import { tryCatch } from '../../../lib/util/error'
import { search } from '../../../lib/util/search'

const source = tryCatch((answers: ConfigurationCreateAnswers, input?: string) => {
  const secretKeys = fetchKubernetesSecretKeys(
    answers.kubernetesContext,
    answers.kubernetesNamespace,
    answers.kubernetesSecret
  )
  return search(secretKeys, input)
})

export const kubernetesSecretKeyPrompt = {
  type: 'autocomplete',
  name: 'kubernetesSecretKey',
  message: 'Choose Kubernetes secret key containing Redis certificate:',
  source,
}
