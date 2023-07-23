import memoize from 'memoizee'
import yaml from 'js-yaml'
import { Secret } from 'kubernetes-models/v1'
import { execCommand, execCommandMultiline } from '../util/exec'

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

export const createKubernetesSecret = (
  context: string,
  namespace: string,
  name: string,
  certificate: string
): string => {
  const secretModel = new Secret({
    type: 'Opaque',
    metadata: {
      name,
      namespace,
    },
    stringData: {
      certificate,
    },
  })
  const secretYaml = yaml.dump(secretModel.toJSON())

  return execCommand(`
    echo "${secretYaml}" | kubectl create --context=${context} -f -
  `)
}
