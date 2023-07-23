import { fetchKubernetesSecrets } from '../kubectl/secrets'
import { tryCatch } from '../util/error'
import { search } from '../util/search'

type Answers = {
  kubernetesContext: string
  kubernetesNamespace: string
}

const source = tryCatch(
  ({ kubernetesContext, kubernetesNamespace }: Answers, input?: string) => {
    const secrets = fetchKubernetesSecrets(kubernetesContext, kubernetesNamespace)
    return search(secrets, input)
  }
)

export const kubernetesSecretPrompt = {
  type: 'autocomplete',
  name: 'kubernetesSecret',
  message: 'Choose Kubernetes secret containing Redis certificate:',
  source,
}
