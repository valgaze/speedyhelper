## speedyhelper

Various helper tools for **[speedybot](https://github.com/valgaze/speedybot)**


|         **Command**         |**Description**                                                                                     |
| :-------------------------: | :--------------------------------------------------------------------------------------------------  |
| `npx speedyhelper setup`                         | Scaffold + boot a speedybot starter project      |
| `npx speedyhelper tunnel`                        | Start a tunnel (specify a port with -p, defaults to 8000, ex: ```npx speedyhelper tunnel 8000```)                                                         |
| `npx speedyhelper web`                           | Kick off a web-based chat interface, -s flag to skip questions             |
| `npx speedyhelper sendmsg`                       | Send a message to a room using bot access token  |
| `npx speedyhelper webhook list -t aaa-bbb-ccc`                    | List webhooks associated with token  |
| `npx speedyhelper webhook register -t aaa-bbb-ccc -w https://aaabbbcccdddeee.execute-api.us-east-1.amazonaws.com`                       | Register firehose webhook event at provided URL  |
| `npx speedyhelper sendmsg`                       | Send a message to a room using bot access token  |
| `npx speedyhelper webhook remove -t aaa-bbb-ccc`     | remove all webhooks associated with token, pass -w to remove only webhooks registered at a certain URL |
