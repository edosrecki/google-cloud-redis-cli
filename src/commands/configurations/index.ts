import { Command } from 'commander'
import { logError } from '../../lib/util/error'
import { createConfiguration } from './create'
import { showConfigurationPath } from './path'
import { removeConfiguration } from './remove'
import { runConfiguration, runConfigurationByName } from './run'
import { showConfiguration } from './show'

export async function addConfigurationsCommands(program: Command) {
  const configurations = new Command('configurations')
  configurations.description('create and run Redis proxy configurations')

  configurations
    .command('create')
    .alias('edit')
    .description('create or edit Redis proxy configuration')
    .action(async () => {
      try {
        await createConfiguration()
      } catch (error) {
        logError(error)
      }
    })

  configurations
    .command('show')
    .description('show Redis proxy configuration')
    .action(async () => {
      try {
        await showConfiguration()
      } catch (error) {
        logError(error)
      }
    })

  configurations
    .command('remove')
    .alias('rm')
    .description('remove Redis proxy configuration')
    .action(async () => {
      try {
        await removeConfiguration()
      } catch (error) {
        logError(error)
      }
    })

  configurations
    .command('run')
    .argument('[name]', 'configuration name, optional')
    .description('run Redis proxy configuration')
    .action(async (name?: string) => {
      try {
        if (name) {
          runConfigurationByName(name)
        } else {
          await runConfiguration()
        }
      } catch (error) {
        logError(error)
      }
    })

  configurations
    .command('path')
    .description('show path to local configurations file')
    .action(() => {
      showConfigurationPath()
    })

  program.addCommand(configurations)
}
