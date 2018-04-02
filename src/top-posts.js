const RedditApi = require('./api');
const secret = require('./secret');

const topPosts = async (subreddit, numRequested) => {

  // check params
  if (!subreddit) throw new Error('Subreddit must be specified');
  if (!numRequested) throw new Error('Number of posts must be specified');

  // init reddit api
  const redditApi = new RedditApi();
  const {id, password} = secret;
  await redditApi.login(id, password);

  const posts = [];  // build array of posts
  let after = null;
  let count = 0;
  while (count < numRequested) {
    // build url to api
    const remaining = numRequested - count;
    const limit = remaining < 100 ? remaining : 100;
    let url = `https://oauth.reddit.com/r/${subreddit}/search.json?sort=top&t=all&restrict_sr=1&limit=${limit}`;
    if (after) url = `${url}&after=${after}`;
    if (count) url = `${url}&count=${count}`;

    // send request
    let data;
    try {
      data = await redditApi.sendRequest(url);
    } catch (error) {
      console.log(error);
      break;
    }
    
    // update listing slice
    after = data.after;
    count += data.dist;

    // do something with  posts
    data.children.forEach(post => {
      posts.push(post.data.title);
    })

    console.log(`Response received: ${count} / ${numRequested}`);
  }

  return posts;

}

module.exports = topPosts;