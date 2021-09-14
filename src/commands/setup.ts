// WIP: select multiple tempaltes
import {Command, flags} from '@oclif/command'
import { prompt} from './../util'
import { resolve } from 'path'
import { execSync } from 'child_process'

export default class setup extends Command {
  static description = 'Quickly scaffold, configure, and boot an agent)'

  static examples = [
    '$ speedyhelper setup -t aaa-bbb-ccc',
  ]

  static flags = {
    token: flags.string({char: 't', description: 'Your bot\'s access token'}),
    directory: flags.string({char: 'd', description: 'Desired directory, defaults to current dir'})
  }

  async cmd(cmd) {
    try {
      execSync(cmd, {
        stdio: [0, 1, 2], // we need this so node will print the command output
        cwd: resolve(process.cwd()), // path to where you want to save the file
      })
    } catch(e) {
      this.error(e)
    }

  }

  async run() {
    const {flags} = this.parse(setup)
    let { token, directory }  = flags
    if (!token) {
      const ans = await prompt('What is your bot token? (Make one here: https://developer.webex.com/my-apps/new/bot)')
      token = ans.choice
    }

    if (!directory) {
      const ans = await prompt(`What directory? (leave blank to default to 'speedybot-starter')`)
      directory = ans.choice ? ans.choice : 'speedybot-starter'
    }

    const targetPath = resolve(process.cwd(), directory as string)
    const repoPath = 'https://github.com/valgaze/speedybot-starter'
    
    // TODO: execa, listr, fancy'ize, support multiple templates, etc

    // 1) clone
    await this.cmd(`git clone ${repoPath} ${directory}`)

    // 2) install deps
    await this.cmd(`cd ${targetPath} && npm i`)

    // 3) write config
    await this.cmd(`cd ${targetPath} && npm run write:json ${token}`)

    // 4) boot
    await this.cmd(`cd ${targetPath} && npm start`)

  }
}
