import {Command, flags} from '@oclif/command'
import {picker, webexHelper, prompt} from './../util'
export default class Sendmsg extends Command {
  static description = 'Send a message to a room (requires authentication token)'

  static examples = [
    '$ speedyhelper sendmsg -t aaa-bbb-ccc',
  ]

  static flags = {
    token: flags.string({char: 't', description: 'Your bot\'s access token'}),
    roomId: flags.string({char: 'r', description: 'Room id where to send the message'}),
    message: flags.string({char: 'm', description: 'Plaintext message to send'}),
  }

  async run() {
    const {flags} = this.parse(Sendmsg)
    let token = flags.token
    if (!token) {
      const ans = await prompt('What is your bot token? (Make one here: https://developer.webex.com/my-apps/new/bot)')
      token = ans.choice
    }

    const inst = webexHelper(token as string)

    let room = flags.roomId
    if (!room) {
      const rooms = await inst.getRooms()
      const {choice} = await picker(rooms, 'Pick a room')
      room = choice
    }
    let msg = flags.message
    if (!msg) {
      const ans = await prompt('What is your message?')
      msg = ans.choice
    }
    await inst.sendMessage(room as string, msg as string)

    this.log(`Message sent to ${room}`)
  }
}
