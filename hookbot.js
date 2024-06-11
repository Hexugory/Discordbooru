const request = require('request-promise-native');
const fs = require('fs');
require('dotenv').config();

const booru_url = process.env.BOORU_URL;
const baseTags = process.env.BASE_TAGS || '';
webhooksPath = process.env.WEBHOOKS_PATH;
var recentID;
var previousID;

if (!webhooksPath) {
    webhooksPath = "/usr/src/app/webhooks.json"
}

let webhooks;
try {
    webhooks = JSON.parse(fs.readFileSync(webhooksPath, 'utf8'));
} catch (err) {
    console.error('Error reading webhooks file:', err);
    process.exit(1);
}

request(`${booru_url}/posts.json${baseTags ? `?tags=${baseTags}&` : '?'}limit=1`, { json: true }).then((posts) => {
    recentID = posts[0].id;
    return console.log(`Starting at ${recentID}`);
}).catch(console.error);

setInterval(() => {
    console.log(`Checking Danbooru starting at ${recentID}`);
    request(`${booru_url}/posts.json?tags=${baseTags ? baseTags + '+' : ''}id:>=${recentID}`, { json: true }).then((posts) => {
        recentID = posts[0].id;
        if (previousID) posts.splice(posts.findIndex(post => { return post.id === previousID }), 1);
        previousID = recentID;
        posts.forEach(post => {
            webhooks.forEach(hook => {
                if (hook.tags.every(tag => { return post.tag_string.includes(tag) }) && (hook.safe ? post.rating === 's' : post.rating != 's')) {
                    console.log(`${post.id} matches ${hook.tags} safe: ${hook.safe}`);

                    if (hook.exclusionTags.some(tag => post.tag_string.includes(tag))) {
                        return console.log('Post contains excluded tags');
                    }

                    let color = post.id - (Math.floor(post.id / 16777215) * 16777215);
                    let options = {
                        method: 'POST',
                        uri: `https://canary.discordapp.com/api/webhooks/${hook.uri}`,
                        body: {
                            embeds: [{
                                title: `${post.tag_string_character} by ${post.tag_string_artist}`,
                                url: `${booru_url}/posts/${post.id}`,
                                image: { url: post.file_url },
                                timestamp: post.created_at,
                                color: color,
                                description: `[Large](${post.large_file_url})`
                            }]
                        },
                        json: true
                    };
                    return request(options).catch(console.error);
                }
            });
        });
    }).catch(console.error);
}, 60000);
