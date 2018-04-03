const RedditApi = require('./api');
const secret = require('../secret');
const db = require('./db')

const topPosts = async (subreddit, numRequested) => {
  // time function
  const startTime = Date.now();

  // check params
  if (!subreddit) throw new Error('Subreddit must be specified');
  if (!numRequested) throw new Error('Number of posts must be specified');

  // init reddit api
  const redditApi = new RedditApi();
  const {id, password} = secret;
  await redditApi.login(id, password);

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
    console.log(`Response received: ${count} / ${numRequested}`);

    // insert into db
    const posts = data.children.map(post => {
      return {
        _id: post.data.id,
        title: post.data.title,
        author: post.data.author,
        score: post.data.score,
        datePosted: post.data.created_utc * 1000,
        url: post.data.url,
        urlDomain: post.data.domain,
        thumbnail: post.data.thumbnail,
        numComments: post.data.num_comments,
        commentLink: post.data.permalink,
      }
    })

    try {
      await db.Post.insertMany(posts, {ordered: false});
    } catch (error) {
      // continue
    }
    
  }

  const elapsed = Date.now() - startTime;
  const sec = (elapsed / 1000).toFixed(0);
  console.log(sec + ' seconds taken');

}

module.exports = topPosts;