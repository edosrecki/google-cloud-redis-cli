import { fetchKubernetesContexts } from '../kubectl/contexts'
import { tryCatch } from '../util/error'
import { search } from '../util/search'

const source = tryCatch((_, input?: string) => {
  const instances = fetchKubernetesContexts()
  return search(instances, input)
})

export const kubernetesContextPrompt = {
  type: 'autocomplete',
  name: 'kubernetesContext',
  message: 'Choose Kubernetes context to run Redis proxy pod:',
  source,
}
