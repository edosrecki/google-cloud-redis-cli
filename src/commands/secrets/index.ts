import { Command } from 'commander'
import { logError } from '../../lib/util/error'
import { createSecret } from './create'

export async function addSecretsCommands(program: Command) {
  const secrets = new Command('secrets')
  secrets.description('manage Kubernetes secrets for Redis certificates')

  secrets
    .command('create')
    .description('create Kubernetes secret containing Google Cloud Redis certificate')
    .action(async () => {
      try {
        await createSecret()
      } catch (error) {
        logError(error)
      }
    })

  program.addCommand(secrets)
}
