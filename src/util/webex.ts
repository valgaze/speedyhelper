import * as Webex from 'webex'

export class Helper {
    webex: any

    // type w/ inst
    constructor(token: string) {
      this.webex = Webex.init({
        credentials: {
          access_token: token,
        },
      })
    }

    async sendMessage(roomId: string, msg: string) {
      return await this.webex.messages.create({roomId, text: msg})
    }

    async getAssociatedRooms(max = 100) {
      return await this.webex.rooms.list({max})
    }

    async getRooms() {
      const rooms = await this.getAssociatedRooms()
      const roomList = rooms.items.map(room => {
        return {id: room.id, title: room.title, value: room.id, name: room.title}
      })
      return roomList
    }

    async sendCard(roomId: string, msg = 'Hello world') {
      const cardJson = {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          type: 'AdaptiveCard',
          version: '1.0',
          body: [
            {
              type: 'TextBlock',
              text: msg,
              size: 'large',
            },
          ],
          actions: [
            {
              type: 'Action.OpenUrl',
              url: 'http://adaptivecards.io',
              title: 'Learn More',
            },
          ],
        },
      }
      return await this.webex.messages.create({roomId, text: msg, attachments: [cardJson]})
    }
}

export const webexHelper = (token: string) => new Helper(token)
