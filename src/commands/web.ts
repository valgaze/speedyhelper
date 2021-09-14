import {Command, flags} from '@oclif/command'
import { resolve } from 'path'
import { serveUi, webexHelper, prompt, picker } from './../util'
import cli from 'cli-ux'

export default class Web extends Command {

  static description = 'Launch a web ui (defaults to port 8080)'

  static examples = [
    `$ speedyhelper web`,
    '$ speedyhelper web -p 8001',
    '$ speedyhelper web -t xxx-access_token_here-xxx -r xxxx_room_id_here_xxx'

  ]

  static flags = {
    port: flags.string({char: 'p', description: 'Port to launch server, default to 8080', default: '8080'}),
    quiz: flags.boolean({char: 'q', description: 'Interactively ask user for access token and room id'}),
    token: flags.string({char: 't', description: 'Your bot\'s access token (or your personal bearer token)'}),
    roomId: flags.string({char: 'r', description: 'Room id where to send the message'}),
  }

  async run() {
    const {flags} = this.parse(Web)
    const { port } = flags;
    const filePath = resolve(__dirname, '..', 'util', 'ui', 'ui.html')
    let urlPath = `http://localhost:${port}/ui.html`
    this.log('Note: Bots tokens currently can only access mentions (1-1 conversations), not entire conversations or rooms')
    if (flags.quiz) {

      let token = flags.token
      if (!token) {
      const ans = await prompt(`What is your access token?

If you don't have one,
- Make one here: https://developer.webex.com/my-apps/new/bot
- OR copy the Bearer token here: https://developer.webex.com/docs/api/v1/rooms/list-rooms

Otherwise enter below:
> `)
token = ans.choice
      }

      let roomId = flags.roomId
      if (!roomId) {
        const inst = webexHelper(token as string)  
        const rooms = await inst.getRooms()
        const res = await picker(rooms, 'Pick a room')
        roomId = res.choice
      }
      if (token && roomId) {
        urlPath = `${urlPath}?access_id=${token}&room_id=${roomId}`
      }
    }
    const server = await serveUi(filePath, Number(port))
    await cli.open(urlPath)
    this.log(`Opening site available below (press any key to exit): 

${urlPath}

`)
  await cli.anykey()
  this.exit(0)

  }
}
