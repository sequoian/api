const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.connect = dbName => {
  mongoose.connect('mongodb://localhost/' + dbName);
}

exports.disconnect = () => {
  mongoose.connection.close();
}

const SubredditSchema = new Schema({
  name: String,
  lastUpdated: Date,
  count: Number,
  after: String
});

exports.Subreddit = mongoose.model('Subreddit', SubredditSchema);

const PostSchema = new Schema({
  _id: String,
  title: String,
  author: String,
  score: Number,
  datePosted: Date,
  url: String,
  urlDomain: String,
  thumbnail: String,
  numComments: Number,
  commentLink: String,
  subreddit: String
});

exports.Post = mongoose.model('Post', PostSchema);