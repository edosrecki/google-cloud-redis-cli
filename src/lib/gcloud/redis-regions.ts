import memoize from 'memoizee'
import { execCommandMultilineWithHeader } from '../util/exec'

export const fetchGoogleCloudRedisRegions = memoize((project: string): string[] => {
  return execCommandMultilineWithHeader(`
      gcloud redis regions list \
        --project=${project} \
        --quiet
    `)
})
