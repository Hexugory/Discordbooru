const request = require('request-promise-native');
var webhooks = require('./webhooks.json');
var baseTags = '';
var recentID;
var previousID;

request(`https://danbooru.donmai.us/posts.json${baseTags ? `?tags=${baseTags}&` : '?'}limit=1`,{json: true}).then((posts)=>{
    recentID = posts[0].id;
    console.log(`Starting at ${recentID}`)
}).catch(console.error);

setInterval(()=>{
    console.log(`Checking Danbooru starting at ${recentID}`)
    request(`https://danbooru.donmai.us/posts.json?tags=${baseTags ? baseTags+'+' : ''}id:>=${recentID}`,{json: true}).then((posts) => {
        recentID = posts[0].id;
        if(previousID === recentID) posts.splice(0,1);
        previousID = recentID;
        posts.forEach(post => {
            webhooks.forEach(hook => {
                if(hook.tags.every(tag => {return post.tag_string.includes(tag)}) && hook.safe ? post.rating === 's' : post.rating != 's'){
                    console.log(`${post.id} matches ${hook.tags} safe: ${hook.safe}`)
                    let options = {
                        method: 'POST',
                        uri: `https://canary.discordapp.com/api/webhooks/${hook.uri}`,
                        body: {
                            embeds: [{
                                title: `New post matching ${hook.tags} ${hook.safe ? '' : '-'}rating:s`,
                                url: `https://danbooru.donmai.us/posts/${post.id}`,
                                image: {url:post.file_url}
                            }]
                        },
                        json: true
                    };
                    if(post.tag_string.includes('guro') || (post.tag_string.includes('loli') && post.rating != 's')){
                        delete options.body.embeds[0].image;
                        options.body.embeds[0].title += ' (not allowed by discord)';
                    };
                    request(options);
                };
            });
        });
    }).catch(console.error);
}, 60000)