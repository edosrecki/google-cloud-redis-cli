import {
  fetchGoogleCloudRedisInstances,
  GoogleCloudRedisInstance,
} from '../../../lib/gcloud/redis-instances'
import { fetchGoogleCloudRedisRegions } from '../../../lib/gcloud/redis-regions'
import { ConfigurationCreateAnswers } from '../../../lib/types'
import { tryCatchAsync } from '../../../lib/util/error'
import { searchByKey } from '../../../lib/util/search'

const formatInstance = (instance: GoogleCloudRedisInstance) => {
  const { name, region } = instance
  return {
    name: `${name} (${region})`,
    short: name,
    value: instance,
  }
}

const source = tryCatchAsync(
  async (answers: ConfigurationCreateAnswers, input?: string) => {
    const regions = fetchGoogleCloudRedisRegions(answers.googleCloudProject)
    const instances = await fetchGoogleCloudRedisInstances(answers.googleCloudProject, regions)
    const filtered = searchByKey(instances, 'name', input)

    return filtered.map(formatInstance)
  }
)

export const googleCloudRedisInstancePrompt = {
  type: 'autocomplete',
  name: 'googleCloudRedisInstance',
  message: 'Choose Google Cloud Redis instance:',
  source,
}
