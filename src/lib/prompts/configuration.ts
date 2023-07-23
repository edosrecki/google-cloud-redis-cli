import { getConfigurations } from '../configurations'
import { Configuration } from '../types'
import { tryCatch } from '../util/error'
import { searchByKey } from '../util/search'

const formatConfiguration = (configuration: Configuration) => {
  return {
    name: configuration.configurationName,
    short: configuration.configurationName,
    value: configuration,
  }
}

const source = tryCatch((_, input?: string) => {
  const configurations = getConfigurations()
  const filtered = searchByKey(configurations, 'configurationName', input)

  return filtered.map(formatConfiguration)
})

export const configurationPrompt = {
  type: 'autocomplete',
  name: 'configuration',
  message: 'Choose configuration:',
  source,
}
