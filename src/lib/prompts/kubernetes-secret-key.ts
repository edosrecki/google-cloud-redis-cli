import { fetchKubernetesSecretKeys } from '../kubectl/secret-keys'
import { tryCatch } from '../util/error'
import { search } from '../util/search'

type Answers = {
  kubernetesContext: string
  kubernetesNamespace: string
  kubernetesSecret: string
}

const source = tryCatch(
  (
    { kubernetesContext, kubernetesNamespace, kubernetesSecret }: Answers,
    input?: string
  ) => {
    const secretKeys = fetchKubernetesSecretKeys(
      kubernetesContext,
      kubernetesNamespace,
      kubernetesSecret
    )
    return search(secretKeys, input)
  }
)

export const kubernetesSecretKeyPrompt = {
  type: 'autocomplete',
  name: 'kubernetesSecretKey',
  message: 'Choose Kubernetes secret key containing Redis certificate:',
  source,
}
