import { bold, green, red } from 'chalk'
import inquirer from 'inquirer'
import autocomplete from 'inquirer-autocomplete-prompt'
import { saveConfiguration } from '../../lib/configurations'
import { ConfigurationCreateAnswers } from '../../lib/types'
import { configurationNamePrompt } from './prompts/configuration-name'
import { confirmationPrompt } from './prompts/confirmation'
import { googleCloudProjectPrompt } from './prompts/google-cloud-project'
import { googleCloudRedisInstancePrompt } from './prompts/google-cloud-redis-instance'
import { kubernetesContextPrompt } from './prompts/kubernetes-context'
import { kubernetesNamespacePrompt } from './prompts/kubernetes-namespace'
import { kubernetesSecretPrompt } from './prompts/kubernetes-secret'
import { kubernetesSecretKeyPrompt } from './prompts/kubernetes-secret-key'
import { localPortPrompt } from './prompts/local-port'

export const createConfiguration = async () => {
  inquirer.registerPrompt('autocomplete', autocomplete)

  const answers = await inquirer.prompt<ConfigurationCreateAnswers>([
    googleCloudProjectPrompt,
    googleCloudRedisInstancePrompt,
    kubernetesContextPrompt,
    kubernetesNamespacePrompt,
    kubernetesSecretPrompt,
    kubernetesSecretKeyPrompt,
    localPortPrompt,
    configurationNamePrompt,
    confirmationPrompt,
  ])

  if (answers.confirmation) {
    saveConfiguration(answers)

    console.log(green(`Saved configuration '${bold(answers.configurationName)}'.`))
  } else {
    console.log(red('You are excused.'))
  }
}
