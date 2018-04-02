const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  subreddit: {
    type: Schema.Types.ObjectId, 
    ref: 'Subreddit'
  },
  readIt: {
    type: Boolean,
    default: false
  },
});

exports.Post = mongoose.model('Post', PostSchema);