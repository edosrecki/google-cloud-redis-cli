import { EOL } from 'os'
import shell from 'shelljs'
import { CommandExecutionError } from './error'

// Sync
export const execCommandAttached = (command: string) => {
  shell.exec(command)
}

export const execCommand = (command: string): string => {
  const { stdout, stderr, code } = shell.exec(command, { silent: true })

  if (code !== 0) {
    throw new CommandExecutionError(command, stderr, stdout)
  }

  return stdout.trim()
}

export const execCommandMultiline = (command: string): string[] => {
  return execCommand(command).split(EOL)
}

export const execCommandMultilineWithHeader = (command: string): string[] => {
  return execCommandMultiline(command).slice(1)
}

// Async
export const execCommandAsync = async (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    shell.exec(command, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        reject(new CommandExecutionError(command, stderr, stdout))
      }

      resolve(stdout.trim())
    })
  })
}

export const execCommandMultilineAsync = async (command: string): Promise<string[]> => {
  const stdout = await execCommandAsync(command)

  return stdout.split(EOL)
}

export const execCommandMultilineWithHeaderAsync = async (
  command: string
): Promise<string[]> => {
  const stdout = await execCommandMultilineAsync(command)

  return stdout.slice(1)
}
