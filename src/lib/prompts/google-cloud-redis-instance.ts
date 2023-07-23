import {
  fetchGoogleCloudRedisInstances,
  fetchGoogleCloudRedisRegions,
  GoogleCloudRedisInstance,
} from '../gcloud/redis'
import { tryCatchAsync } from '../util/error'
import { searchByKey } from '../util/search'

type Answers = { googleCloudProject: string }

const formatInstance = (instance: GoogleCloudRedisInstance) => {
  const { name, region } = instance
  return {
    name: `${name} (${region})`,
    short: name,
    value: instance,
  }
}

const source = tryCatchAsync(async ({ googleCloudProject }: Answers, input?: string) => {
  const regions = fetchGoogleCloudRedisRegions(googleCloudProject)
  const instances = await fetchGoogleCloudRedisInstances(googleCloudProject, regions)
  const filtered = searchByKey(instances, 'name', input)

  return filtered.map(formatInstance)
})

export const googleCloudRedisInstancePrompt = {
  type: 'autocomplete',
  name: 'googleCloudRedisInstance',
  message: 'Choose Google Cloud Redis instance:',
  source,
}
