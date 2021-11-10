// WIP: select multiple tempaltes
import {Command, flags} from '@oclif/command'
import { prompt} from './../util'
import { resolve } from 'path'
import { execSync } from 'child_process'
import inquirer from 'inquirer'

export default class setup extends Command {
  static description = 'Quickly scaffold, configure, and boot an agent)'

  static examples = [
    '$ speedyhelper setup -t aaa-bbb-ccc',
  ]

  static flags = {
    token: flags.string({char: 't', description: 'Your bot\'s access token'}),
    nlp: flags.string({char: 'f', description: '(Optional) Token to access language models'}),
    directory: flags.string({char: 'd', description: 'Desired directory, defaults to current dir'}),
    repo: flags.string({char: 'r',description: 'Which speedybot repo to setup, defaults to starter'})
  }

  private repos = {
    'speedybot-starter': {
      url: 'https://github.com/valgaze/speedybot-starter',
      label: '🚀 speedybot-starter (default)',
      value: 'speedybot-starter'
    },
    'speedybot-superpowers': {
      url: 'https://github.com/valgaze/speedybot-superpowers',
      label: '🌟 speedybot-superpowers (give your bot $uperpowers like processing *.xlsx)',
      value: 'speedybot-superpowers'
    },
    // 'speedybot-gpt3': {
    //   url: 'https://github.com/valgaze/speedybot-gpt3',
    //   label: '🤖 speedybot-gpt3 (starter with language model)',
    //   value: 'speedybot-gpt3'
    // },
    "speedybot-serverless": {
      url: 'https://github.com/valgaze/speedybot-serverless-experiment',
      label: '📡 speedybot-serverless (easy-to-deploy serverless lambda function [EXPERIMENTAL])',
      value: 'speedybot-serverless'
    }
  }

  async cmd(cmd) {
    try {
      execSync(cmd, {
        stdio: [0, 1, 2],
        cwd: resolve(process.cwd()),
      })
    } catch(e) {
      console.log('Error', e)
    }
  }

  async run() {
    const {flags} = this.parse(setup)
    let { token, directory, repo, nlp }  = flags
    let shouldLaunch = true

    if (!repo) {
      const res: {repo: string} = await inquirer
        .prompt([
          {
            type: 'list',
            name: 'repo',
            message: 'Choose a starter template',
            choices: Object.values(this.repos).map(({value, label}) => { return {name: label, value: value } })
          },
        ])
        repo = res.repo
    } else {
      const valid = Object.values(this.repos).map(repo => repo.value)
      if (!valid.includes(repo)) {
        this.log(`\nValid values: ${valid.join(', ')}\n`)
        this.error(`Invalid -r option ('${repo}') selected, exiting...`)
      }
    }

    if (!token) {
      const ans = await prompt('What is your bot token? (Make one here: https://developer.webex.com/my-apps/new/bot)')
      token = ans.choice
    }

    if (!nlp && repo === 'speedybot-gpt3') {
      const ans = await prompt('What is your gpt3 token? (Leave blank to fill in later)')
      nlp = ans.choice
      if (!nlp) {
        shouldLaunch = false
      }
    }
    
    if (repo === 'speedybot-serverless-experiment') {
      shouldLaunch = false
    }

    if (!directory) {
      const ans = await prompt(`What directory? (leave blank to default to ${repo})`)
      directory = ans.choice ? ans.choice : repo
    }

    if (!token) {
      shouldLaunch = false
    }
    const targetPath = resolve(process.cwd(), directory as string)
    const repoPath = this.repos[repo].url
    // TODO: execa, listr, fancy'ize, support multiple templates, etc

    // 1) clone
    await this.cmd(`git clone ${repoPath} ${directory}`)

    // 2) install deps
    await this.cmd(`cd ${targetPath} && npm i`)

    // 3) write config
    if (shouldLaunch) {
      const JSONwrite = nlp ? `${token} ${nlp}` : token
      await this.cmd(`cd ${targetPath} && npm run write:json ${JSONwrite}`)

      // 4) boot
      try {
        await this.cmd(`cd ${targetPath} && npm start`)
      }catch(e) {}
    } else {
      this.log('Complete!')
      this.log(`\n\nYour project is available here: ${targetPath}\n\n`)
    }
  }
}
