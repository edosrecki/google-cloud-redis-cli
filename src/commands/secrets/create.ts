import { bold, green, red } from 'chalk'
import inquirer from 'inquirer'
import autocomplete from 'inquirer-autocomplete-prompt'
import { confirmationPrompt } from '../../lib/prompts/confirmation'
import { googleCloudProjectPrompt } from '../../lib/prompts/google-cloud-project'
import { googleCloudRedisInstancePrompt } from '../../lib/prompts/google-cloud-redis-instance'
import { kubernetesContextPrompt } from '../../lib/prompts/kubernetes-context'
import { kubernetesNamespacePrompt } from '../../lib/prompts/kubernetes-namespace'
import { kubernetesSecretNamePrompt } from '../../lib/prompts/kubernetes-secret-name'
import { saveSecret } from '../../lib/secrets'
import { SecretCreateAnswers } from '../../lib/types'

export const createSecret = async () => {
  inquirer.registerPrompt('autocomplete', autocomplete)

  const answers = await inquirer.prompt<SecretCreateAnswers>([
    googleCloudProjectPrompt,
    googleCloudRedisInstancePrompt,
    kubernetesContextPrompt,
    kubernetesNamespacePrompt,
    kubernetesSecretNamePrompt,
    confirmationPrompt,
  ])

  if (answers.confirmation) {
    saveSecret(answers)

    console.log(green(`Created secret '${bold(answers.kubernetesSecretName)}'.`))
  } else {
    console.log(red('You are excused.'))
  }
}
