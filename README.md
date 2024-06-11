# Environment Variables
|             |   |
|-------------|---|
|  BOORU_URL  |URL to your Danbooru instance|
|  BASE_TAGS  |List of tags to filter all webhooks by, separated by +|
|WEBHOOKS_PATH|Path to your `webhooks.json`|

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
    "exclusionTags": [],
    "uri": "id/token",
    "minRating": "g",
    "maxRating": "g",
    "color": "0x1e1e2c"
  }
]
```



# Running Manually

Requires [NodeJS](https://nodejs.org/en)

Install dependencies using `npm i`

Run using `node hookbot.js`