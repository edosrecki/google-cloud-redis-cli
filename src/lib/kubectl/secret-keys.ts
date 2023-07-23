import memoize from 'memoizee'
import { execCommand } from '../util/exec'

export const fetchKubernetesSecretKeys = memoize(
  (context: string, namespace: string, secret: string): string[] => {
    const json = execCommand(`
      kubectl get secret ${secret} \
        --namespace="${namespace}" \
        --context="${context}" \
        --output='jsonpath={.data}'
    `)
    const data = JSON.parse(json)

    return Object.keys(data)
  }
)
