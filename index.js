const RedditApi = require('./api')
const secret = require('./secret')

const toGet = 300
const limit = 100
let count = 0
let after = null
const posts = []

const redditApi = new RedditApi()
redditApi.login(secret.id, secret.password).then(() => {
  return redditApi.getTopPosts('aww', 300)
}).then(posts => {
  posts.forEach((post, idx) => {
    console.log(idx+1 + ') ' + post.data.title)
  })
})
.catch(error => console.log(error))


// response.data.data.children.forEach(p => {
//   const data = p.data
//   posts.push({
//     id: data.id,
//     title: data.title,
//     url: data.url,
//     created: data.created_utc,
//     score: data.score,
//     author: data.author,
//     domain: data.domain,
//     numComments: data.num_comments,
//     commentLink: data.permalink,
//     subreddit: data.subreddit,
//     thumbnail: data.thumbnail,
//   })
// })
    