import yaml from 'js-yaml'
import { bold, cyan } from 'chalk'
import { Pod } from 'kubernetes-models/v1'
import { execCommand, execCommandAttached } from '../util/exec'

type CloudRedisProxyPod = {
  name: string
  context: string
  namespace: string
  secret: string
  secretKey: string
  localPort: number
  remoteHost: string
  remotePort: string
}

export const runCloudRedisProxyPod = (pod: CloudRedisProxyPod): string => {
  const podModel = new Pod({
    metadata: {
      name: pod.name,
      namespace: pod.namespace,
      annotations: {
        'cluster-autoscaler.kubernetes.io/safe-to-evict': 'true',
      },
      labels: {
        app: 'google-cloud-redis',
      },
    },
    spec: {
      containers: [
        {
          name: pod.name,
          image: 'osrecki/redis-stunnel',
          env: [
            {
              name: 'HOST',
              value: pod.remoteHost,
            },
            {
              name: 'PORT',
              value: pod.remotePort,
            },
          ],
          volumeMounts: [
            {
              name: 'redis-ca',
              mountPath: '/ca',
            },
          ],
        },
      ],
      volumes: [
        {
          name: 'redis-ca',
          secret: {
            secretName: pod.secret,
            items: [{ key: pod.secretKey, path: 'cert.pem' }],
          },
        },
      ],
    },
  })
  const podYaml = yaml.dump(podModel.toJSON())

  return execCommand(`
    echo "${podYaml}" | kubectl create --context=${pod.context} -f -
  `)
}

export const deletePod = (pod: CloudRedisProxyPod) => {
  console.log(`Deleting pod '${bold(cyan(pod.name))}'.`)
  execCommand(`
    kubectl delete pod ${pod.name} \
      --context="${pod.context}" \
      --namespace="${pod.namespace}"
  `)
  console.log(`Pod '${bold(cyan(pod.name))}' deleted.`)
}

export const waitForPodReady = (pod: CloudRedisProxyPod) => {
  console.log(`Waiting for pod '${bold(cyan(pod.name))}'.`)
  execCommand(`
    kubectl wait pod ${pod.name} \
      --for=condition=ready \
      --context="${pod.context}" \
      --namespace="${pod.namespace}"
  `)
  console.log(`Pod '${bold(cyan(pod.name))}' is ready.`)
}

export const portForward = (pod: CloudRedisProxyPod) => {
  console.log(`Starting port forwarding to pod '${bold(cyan(pod.name))}'.`)
  execCommandAttached(`
    kubectl port-forward ${pod.name} ${pod.localPort}:${pod.remotePort} \
      --context="${pod.context}" \
      --namespace="${pod.namespace}"
  `)
}
