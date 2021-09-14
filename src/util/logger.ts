import colors from 'simple-log-colors';

import { createInterface } from 'readline';

export function log(...payload: any[]) { console.log.apply(console, payload as [any?, ...any[]]); }

export function warning(...payload: any[]) {
	log(colors.yellow(...payload))
}

export function bad(...payload: any[]) {
	color('red', `\n\n# ----------------PROBLEM!------------------- #\n\n`)
	log(colors.red(...payload))
	color('red', `\n\n# ------------------------------------------- #\n\n`)

}

export function good(...payload: any[]) {
	log(colors.green(...payload))
}

export function color(color = "red", ...payload: any[]) {
	try {
		//@ts-ignore
		log(colors[color](...payload))
	} catch {
		log(colors['red'](...payload))
	}
}

export function red(...payload: any[]) { return color('red', ...payload) }

export function loud(...payload: any[]) {
	color('red', `\n\n# ---------------------------------------- #\n\n`)
	log(colors.yellow(...payload))
	color('red', `\n\n# ---------------------------------------- #\n\n`)
}

export function askQuestion(question: string): Promise<string> {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise((resolve, reject) => {
		rl.question(question, function (res) {
			resolve(res);
			rl.close();
		});
	});
}

export async function yesNo(question: string): Promise<boolean> {
	const yay = ['yes', 'y', 'yah', '1', 1, 'true', true];
	const res = await askQuestion(`(y/n) ${question}`);
	return yay.includes(res.toLowerCase());
}

export const ascii_art = (colorSelect = 'green') => {
	color(colorSelect, `
███████╗██████╗ ███████╗███████╗██████╗ ██╗   ██╗██████╗  ██████╗ ████████╗
██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗╚██╗ ██╔╝██╔══██╗██╔═══██╗╚══██╔══╝
███████╗██████╔╝█████╗  █████╗  ██║  ██║ ╚████╔╝ ██████╔╝██║   ██║   ██║   
╚════██║██╔═══╝ ██╔══╝  ██╔══╝  ██║  ██║  ╚██╔╝  ██╔══██╗██║   ██║   ██║   
███████║██║     ███████╗███████╗██████╔╝   ██║   ██████╔╝╚██████╔╝   ██║   
╚══════╝╚═╝     ╚══════╝╚══════╝╚═════╝    ╚═╝   ╚═════╝  ╚═════╝    ╚═╝   
`)

}
export const help = () => {

	ascii_art()
	log(`
See here for a step-by-step guide: https://github.com/valgaze/speedybot/blob/master/quickstart.md
_________________________________

Speedybot makes it easy to QUICKLY stand up a bot without having to worry about infrastructe details

ex. You can edit a single file to handle all your bots logic, receive user data from forms, catch file-upload events and easily extend/integrate with third-party services

Before you start, you'll need a WebEx bot token

- Create one and save the token from here: https://developer.webex.com/my-apps/new/bot

## [CLI] Fast setup & boot
Run the following to scaffold & boot

$ npx speedybot setup xxxxyyyyzzz_bot_token_here_xxxxyyyyzzz


## [Git] Setup & boot
Or alteratively, run

$ git clone https://github.com/valgaze/speedybot speedybot
$ cd speedybot
$ npm run setup
# Save your bot token to speedybot/settings/config.json under the "token" field
$ npm start

Once your agent is running:

- Start a 1-1 session with the bot & ask it "healthcheck" to verify all's well

If any trouble, see here: https://github.com/valgaze/speedybot/blob/master/quickstart.md`)

}