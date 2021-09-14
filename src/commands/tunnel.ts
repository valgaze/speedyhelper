import {Command, flags} from '@oclif/command'
import {activateTunnel} from './../util'
export default class Tunnel extends Command {
  static description = 'Start a tunnel using nGrok-- for details, see $ speedyhelper help tunnel'

  static examples = [
    '$ speedyhelper tunnel',
    '$ speedyhelper tunnel 8000',
    '$ speedyhelper tunnel -p 8000',
  ]

  static flags = {
    port: flags.string({char: 'p', default: String(8000), description: 'Port number to forward (defaults to 8000)'}),
  }

  static args = [{name: 'port'}]

  async run() {
    const {flags, args} = this.parse(Tunnel)
    const port = args.port ? args.port : flags.port
    await activateTunnel(port)
  }
}
