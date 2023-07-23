import { fetchGoogleCloudProjects } from '../gcloud/projects'
import { tryCatch } from '../util/error'
import { search } from '../util/search'

const source = tryCatch((_, input?: string) => {
  const projects = fetchGoogleCloudProjects()
  return search(projects, input)
})

export const googleCloudProjectPrompt = {
  type: 'autocomplete',
  name: 'googleCloudProject',
  message: 'Choose Google Cloud project containing Redis instance:',
  source,
}
