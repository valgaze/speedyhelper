import inquirer from 'inquirer'
import inquirerprompt from 'inquirer-autocomplete-prompt'

export const prompt = async (message: string) => {
  return await inquirer
  .prompt(
    {
      type: 'input',
      message,
      name: 'choice',
    })
}
/**
 * ex.
 * ```
 * const selection = await picker(['basic starter', 'expressjs server starter', 'DialogFlow starter', 'GPT3 starter'])
 *
 * ```
 * @param choices
 *
 * @returns Promise<string[]>
 */
export const picker = async (choices, message = 'Select from below') => {
  return await inquirer
  .prompt([
    {
      type: 'list',
      message,
      name: 'choice',
      choices,
      validate(answer) {
        if (answer.length === 0) {
          return 'You must choose at one item'
        }
        return true
      },
    },
  ])
}

export const autoPicker = async api => {
  inquirer.registerPrompt('autocomplete', inquirerprompt)
  return await inquirer.prompt([{
    type: 'autocomplete',
    name: 'target',
    message: 'Select from list below',
    source: async answersSoFar => await api.getRooms(),
    // TODO: tidy this up so it works
  }])
}
