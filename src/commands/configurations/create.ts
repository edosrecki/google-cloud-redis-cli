import { bold, green, red } from 'chalk'
import inquirer from 'inquirer'
import autocomplete from 'inquirer-autocomplete-prompt'
import { saveConfiguration } from '../../lib/configurations'
import { configurationNamePrompt } from '../../lib/prompts/configuration-name'
import { confirmationPrompt } from '../../lib/prompts/confirmation'
import { googleCloudProjectPrompt } from '../../lib/prompts/google-cloud-project'
import { googleCloudRedisInstancePrompt } from '../../lib/prompts/google-cloud-redis-instance'
import { googleCloudRedisPrintAuthPrompt } from '../../lib/prompts/google-cloud-redis-print-auth'
import { kubernetesContextPrompt } from '../../lib/prompts/kubernetes-context'
import { kubernetesNamespacePrompt } from '../../lib/prompts/kubernetes-namespace'
import { kubernetesSecretPrompt } from '../../lib/prompts/kubernetes-secret'
import { kubernetesSecretKeyPrompt } from '../../lib/prompts/kubernetes-secret-key'
import { localPortPrompt } from '../../lib/prompts/local-port'
import { ConfigurationCreateAnswers } from '../../lib/types'

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
    googleCloudRedisPrintAuthPrompt,
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
