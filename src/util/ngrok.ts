import * as nGrok from 'ngrok'
import {red, ascii_art, pickRandom} from '.'

export async function nGrokTunnel(config?: NgrokOpts): Promise<string> {
  if (config && !config.addr) {
    if (!config.port) {
      throw new Error('No Port specified')
    }
  }
  try {
    const url = await nGrok.connect(config)
    return url
  } catch (error) {
    console.log('<nGrok> Catastrophic error', error)
    throw error
  }
}

export function displayTunnelData(url: string, port = 8000) {
  const content = `
nGrok tunnnel now active on port ${port}
__________________________


${url}

__________________________
Tip: Inspect/replay traffic requests on http://localhost:4040
By default, is active for 2 hours, use CTRL-C to exit`

  const opts = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
  const color = pickRandom(opts)
  ascii_art(color)
  red(content)
}

export async function activateTunnel(passedConfig: number | NgrokOpts) {
  let config: NgrokOpts = {}
  if (typeof passedConfig === 'string' || typeof passedConfig === 'number') {
    config.addr = passedConfig
  } else if (config) {
    config = passedConfig
  }
  const url = await nGrokTunnel(config)
  const port = config.addr ? config.addr : '8000'
  displayTunnelData(url, Number(port))
}

// All from: https://github.com/bubenshchykov/ngrok/blob/master/ngrok.d.ts

type Protocol = 'http' | 'tcp' | 'tls';
type Region = 'us' | 'eu' | 'au' | 'ap' | 'sa' | 'jp' | 'in';
export interface NgrokOpts {
      /**
       * Other "custom", indirectly-supported ngrok process options.
       *
       * @see {@link https://ngrok.com/docs}
       */
      [customOption: string]: any;

      /**
       * The tunnel type to put in place.
       *
       * @default 'http'
       */
      proto?: Protocol;

      /**
       * Port or network address to redirect traffic on.
       *
       * @default opts.port || opts.host || 80
       */
      addr?: string | number;
	  port?: string | number;

      /**
       * HTTP Basic authentication for tunnel.
       *
       * @default opts.httpauth
       */
      auth?: string;

      /**
       * Reserved tunnel name (e.g. https://alex.ngrok.io)
       */
      subdomain?: string;

      /**
       * Your authtoken from ngrok.com
       */
      authtoken?: string;

      /**
       * One of ngrok regions.
       * Note: region used in first tunnel will be used for all next tunnels too.
       *
       * @default 'us'
       */
      region?: Region;

      /**
       * Custom path for ngrok config file.
       */
      configPath?: string;

      /**
       * Custom binary path, eg for prod in electron
       */
      binPath?: (defaultPath: string) => string;

      /**
       * Callback called when ngrok logs an event.
       */
      onLogEvent?: (logEventMessage: string) => any;

      /**
       * Callback called when session status is changed.
       * When connection is lost, ngrok will keep trying to reconnect.
       */
      onStatusChange?: (status: 'connected' | 'closed') => any;

       /**
       * Callback called when ngrok host process is terminated.
       */
      onTerminated?: () => any;
}
