Option for a filter tag in config.json. Check webhooks.json for an example.


# Running with Docker

Compose file
```yaml

services:
  discordbooru:
    image: ghcr.io/hexugory/discordbooru:master
    environment:
      - BOORU_URL=https://booru.kitsunehosting.net
      - BASE_TAGS=
    volumes:
      - /path/to/local/webhooks.json:/usr/src/app/webhooks.json
```

Use the webhooks.json in this repo as an example.

```json
[
  {
    "tags": [],
    "exclusionTags": ["size_difference"],
    "uri": "<WebhookID>/<WebhookToken>",
    "safe": false
  }
]
```



# Running Manually

Requires NodeJS

Install dependencies using `npm i`

Run using `node hookbot.js`
