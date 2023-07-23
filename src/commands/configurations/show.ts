import inquirer from 'inquirer'
import autocomplete from 'inquirer-autocomplete-prompt'
import { ConfigurationChooseAnswers } from '../../lib/types'
import { configurationPrompt } from '../../lib/prompts/configuration'

export const showConfiguration = async () => {
  inquirer.registerPrompt('autocomplete', autocomplete)

  const { configuration } = await inquirer.prompt<ConfigurationChooseAnswers>([
    configurationPrompt,
  ])

  console.dir(configuration)
}
