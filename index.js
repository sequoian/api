const topPosts = require('./top-posts');

topPosts('aww', 25).then(posts => {
  posts.forEach(post => console.log(post));
})

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