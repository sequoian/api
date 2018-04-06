const topPosts = require('./top-posts');
const db = require('./db');

console.log('Connecting to db')
db.connect('reddit').then(async () => {
  try {
    await topPosts('programming', 1000);
    db.disconnect();
    console.log('Done');
  }
  catch (error) {
    console.log(error);
  }
})