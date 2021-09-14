/**
 * WIP!
 *
 */
import {Command, flags} from '@oclif/command'
import {writeFileSync} from 'fs'
import {prompt, easyCardBase} from './../util'
export default class EasyCard extends Command {
  static description = 'Build'

  static examples = [
    '$ speedyhelper easycard',
  ]

  static flags = {
    file: flags.string({char: 'f', description: 'Save to this JSON file (defaults to cwd)'}),
  }

  static hidden = false

  async run() {
    const {flags} = this.parse(EasyCard)
    const {choice: title} = await prompt('What is the card\'s title?')
    const {choice: subtitle} = await prompt('What is the card\'s subtitle?')
    const {choice: text} = await prompt('What text do you want in the card?')
    const cardJson = easyCardBase(title, subtitle, text)
    const prettyJson = JSON.stringify(cardJson, null, 2)
    if (flags.file) {
      writeFileSync(flags.file, prettyJson)
    }
    this.log(prettyJson)
  }
}
