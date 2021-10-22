import {Command, flags} from '@oclif/command'
import {SpeedybotMini} from 'speedybot-mini'
import {picker, webexHelper, prompt} from './../util'
import cli from 'cli-ux'

export default class Webhook extends Command {
  static description = 'Send a message to a room (requires authentication token)'

  static examples = [
    '$ speedyhelper webhook list -t aaa-bbb-ccc # List webhooks associated with token',
    '$ speedyhelper webhook register -t aaa-bbb-ccc -w https://aaabbbcccdddeee.execute-api.us-east-1.amazonaws.com # Register firehose webhook event',
    '$ speedyhelper webhook remove -t aaa-bbb-ccc # remove all webhooks associated with token',
    '$ speedyhelper webhook remove -t aaa-bbb-ccc -w https://aaabbbcccdddeee.execute-api.us-east-1.amazonaws.com # remove specific token'
  ]

  static flags = {
    token: flags.string({char: 't', description: 'Your bot\'s access token'}, ),
    webhookUrl: flags.string({char: 'w', description: 'Publically accessible url for your service'}),
    forceDelete: flags.boolean({char:'f', description: 'If set, will not prompt to proceed'})
  }

  static args = [
    {name: 'action'},
  ]

  async run() {
    const {flags, args} = this.parse(Webhook)
    let token = flags.token
    let webhookUrl = flags.webhookUrl
    if (!token) {
      const ans = await prompt('What is your bot token? (Make one here: https://developer.webex.com/my-apps/new/bot)')
      token = ans.choice
    }

    if (token) {
      const {action} = args
      const inst = new SpeedybotMini(token)

      if (args.action === 'list') {
        const list = await inst.getWebhooks()
        this.log('\n\n## Your current webhooks ## \n\n')
        if (list.data.items.length) {
          this.log(JSON.stringify(list.data.items, null, 2))
        } else {
          this.log(`No webhooks registered, see $ speedyhelper webhook --help`)
        }
      }

      if (args.action === 'remove') {
        if (!webhookUrl) {
          if (!flags.forceDelete) {
            const proceed = await cli.confirm('Without specifying a webhook -w, this will destroy ALL webhooks associated with the token provided. Proceed?')
            if (proceed) {
              const list = await inst.getWebhooks()
              await inst.killAllWebhooks(list.data.items)
              this.log('Your webhooks have been removed')
            } else {
              this.log('Ok, exiting...')
            }
          } else {
            const list = await inst.getWebhooks()
            await inst.killAllWebhooks(list.data.items)
            this.log('Your webhooks have been removed')
          }

        } else {
          await inst.killWebhooksByUrl(webhookUrl)
          this.log(`Attempted to remove webhooks associated with '${webhookUrl}'`)
        }
      }

      if (args.action === 'register') {
        if (!webhookUrl) {
          const ans = await prompt('What is your webhook url? (Must be accessible from public internet)')
          webhookUrl = ans.choice
        }
        if (webhookUrl) {
          await inst.Setup(webhookUrl)
          this.log(`Complete-- see your registerd webhooks with $ speedybot-helper webhooks list`)            
        }
      }

    }
  }
}
