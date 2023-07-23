import { fetchKubernetesNamespaces } from '../kubectl/namespaces'
import { tryCatch } from '../util/error'
import { search } from '../util/search'

type Answers = { kubernetesContext: string }

const source = tryCatch(({ kubernetesContext }: Answers, input?: string) => {
  const instances = fetchKubernetesNamespaces(kubernetesContext)
  return search(instances, input)
})

export const kubernetesNamespacePrompt = {
  type: 'autocomplete',
  name: 'kubernetesNamespace',
  message: 'Choose Kubernetes namespace to run Redis proxy pod:',
  source,
}
