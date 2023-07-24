import boxen from 'boxen'
import memoize from 'memoizee'
import { Configuration } from '../types'
import {
  execCommand,
  execCommandMultilineWithHeader,
  execCommandMultilineWithHeaderAsync,
} from '../util/exec'

export type GoogleCloudRedisInstance = {
  name: string
  region: string
  host: string
  port: string
}

const parseInstance = (instance: string): GoogleCloudRedisInstance => {
  const [name, location, host, port] = instance.split(',')
  const region = location.split('-').slice(0, -1).join('-')

  return { name, region, host, port }
}

export const fetchGoogleCloudRedisRegions = memoize((project: string): string[] => {
  return execCommandMultilineWithHeader(`
      gcloud redis regions list \
        --project=${project} \
        --quiet
    `)
})

const fetchGoogleCloudRedisInstancesForRegion = memoize(
  async (project: string, region: string): Promise<GoogleCloudRedisInstance[]> => {
    const instances = await execCommandMultilineWithHeaderAsync(`
      gcloud redis instances list \
        --project=${project} \
        --region=${region} \
        --format='csv(displayName,locationId,host,port)' \
        --quiet
    `)

    return instances.map(parseInstance)
  }
)

export const fetchGoogleCloudRedisInstances = memoize(
  async (project: string, regions: string[]): Promise<GoogleCloudRedisInstance[]> => {
    const instances = await Promise.all(
      regions.map((region) => fetchGoogleCloudRedisInstancesForRegion(project, region))
    )

    return instances.flat()
  }
)

export const fetchGoogleCloudRedisCertificate = (
  project: string,
  region: string,
  instanceName: string
): string => {
  return execCommand(`
    gcloud redis instances describe ${instanceName} \
      --project=${project} \
      --region=${region} \
      --format='value(serverCaCerts[0].cert)' \
      --quiet
  `)
}

export const printGoogleCloudRedisAuthString = (configuration: Configuration): void => {
  if (!configuration.googleCloudRedisPrintAuth) {
    return
  }

  const { googleCloudProject, googleCloudRedisInstance } = configuration

  const authString = execCommand(`
    gcloud redis instances get-auth-string ${googleCloudRedisInstance.name} \
      --project=${googleCloudProject} \
      --region=${googleCloudRedisInstance.region} \
      --format='value(authString)' \
      --quiet
  `)

  const box = boxen(authString, {
    title: 'Redis AUTH string',
    titleAlignment: 'center',
    borderColor: 'yellow',
    padding: { top: 0, right: 1, bottom: 0, left: 1 },
  })
  console.log(box)
}
