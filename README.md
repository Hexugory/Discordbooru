Option for a filter tag in config.json. Check webhooks.json for an example.


# Running with Docker

Compose file
```yaml

services:
  discordbooru:
    image: ghcr.io/hexugory/discordbooru:master
    environment:
      - BOORU_URL=https://my.danbooru.site
      - BASE_TAGS=
    volumes:
      - /path/to/local/webhooks.json:/usr/src/app/webhooks.json
```

Use the webhooks.json in this repo as an example.

```json
[
  {
    "tags": [],
    "exclusionTags": ["blue_eyes"],
    "uri": "<WebhookID>/<WebhookToken>",
    "safe": false
  }
]
```



# Running Manually

Requires NodeJS

Install dependencies using `npm i`

Run using `node hookbot.js`
