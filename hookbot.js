const request = require('request-promise-native');
var webhooks = require('./webhooks.json');
var config = require('./config.json');
var recentID;
var previousID;

request(`https://danbooru.donmai.us/posts.json${config.baseTags ? `?tags=${config.baseTags}&` : '?'}limit=1`,{json: true}).then((posts)=>{
    recentID = posts[0].id;
    return console.log(`Starting at ${recentID}`);
}).catch(console.error);

setInterval(()=>{
    console.log(`Checking Danbooru starting at ${recentID}`);
    request(`https://danbooru.donmai.us/posts.json?tags=${config.baseTags ? config.baseTags+'+' : ''}id:>=${recentID}`,{json: true}).then((posts) => {
        recentID = posts[0].id;
        if(previousID) posts.splice(posts.findIndex(post => {return post.id === previousID}),1);
        previousID = recentID;
        posts.forEach(post => {
            webhooks.forEach(hook => {
                if(hook.tags.every(tag => {return post.tag_string.includes(tag)}) && (hook.safe ? post.rating === 's' : post.rating != 's')){
                    console.log(`${post.id} matches ${hook.tags} safe: ${hook.safe}`);
					if(post.tag_string.includes('guro') || (post.tag_string.includes('loli') && post.rating != 's')){
                        return console.log('Not allowed by Discord')
                    };
                    let color = post.id-(Math.floor(post.id/16777215)*16777215);
                    let options = {
                        method: 'POST',
                        uri: `https://canary.discordapp.com/api/webhooks/${hook.uri}`,
                        body: {
                            embeds: [{
                                title: `${post.tag_string_character} by ${post.tag_string_artist} (matching ${hook.tags} ${hook.safe ? '' : '-'}rating:s)`,
                                url: `https://danbooru.donmai.us/posts/${post.id}`,
                                image: {url:post.file_url},
                                timestamp: post.created_at,
                                color: color,
                                description: `[Large](${post.large_file_url})`
                            }]
                        },
                        json: true
                    };
                    return request(options).catch(console.error);
                };
            });
        });
    }).catch(console.error);
}, 60000)