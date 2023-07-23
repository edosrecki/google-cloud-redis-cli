import memoize from 'memoizee'
import { execCommandMultiline } from '../util/exec'

export const fetchKubernetesSecrets = memoize(
  (context: string, namespace: string): string[] => {
    return execCommandMultiline(`
    kubectl get secrets \
      --namespace="${namespace}" \
      --context="${context}" \
      --output='jsonpath={range .items[*]}{.metadata.name}{"\\n"}{end}'
  `)
  }
)
