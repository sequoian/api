const topPosts = require('./top-posts');
const db = require('./db');

db.connect('reddit-test');
topPosts('aww', 25).then(async () => {
  //console.log(await db.Post.find());
  db.disconnect();
}).catch(error => {
  console.log(error);
})