import memoize from 'memoizee'
import { execCommandMultilineWithHeaderAsync } from '../util/exec'

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
