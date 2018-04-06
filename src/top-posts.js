const RedditApi = require('./api');
const secret = require('../secret');
const db = require('./db')

const topPosts = async (subreddit, numRequested) => {

  // time function
  const startTime = Date.now();

  // check params
  if (!subreddit) throw new Error('Subreddit must be specified');
  if (!numRequested) throw new Error('Number of posts must be specified');
  if (numRequested > 1000) throw new Error('Number requested cannot exceed 1000');

  // init reddit api
  const redditApi = new RedditApi();
  const {id, password} = secret;
  console.log('Requesting OAuth2 key');
  await redditApi.login(id, password);

  let count = 0;
  let after = null;
  while (count < numRequested) {
    // build url to api
    const remaining = numRequested - count;
    const limit = remaining < 100 ? remaining : 100;
    let url = `https://oauth.reddit.com/r/${subreddit}/top.json?t=all&limit=${limit}`
    if (after) url = `${url}&after=${after}`;
    if (count) url = `${url}&count=${count}`;

    // send request
    console.log('Sending: ', url);
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
    console.log(`Posts received: ${count} / ${numRequested}`);

    // insert into db
    const posts = data.children.map((post, idx) => ({
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
      subreddit
    }))

    try {
      await db.Post.insertMany(posts, {ordered: false});
    } catch (error) {
      // continue
    }

    // check for premature end of listing
    if (data.dist < limit) {
      console.log('Reached end of listing');
      break;
    }
    
  }

  // display time taken
  const elapsed = Date.now() - startTime;
  const sec = (elapsed / 1000).toFixed(2);
  console.log(sec + ' seconds taken');

  // store subreddit info
  if (count > 0) {
    await db.Subreddit.findOneAndUpdate({name: subreddit}, {
      name: subreddit,
      lastUpdated: Date.now()
    }, {upsert: true});
  }

}

module.exports = topPosts;