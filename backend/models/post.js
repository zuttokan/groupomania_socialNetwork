/// call mongoose for creating a schema
const mongoose = require('mongoose');
const MongooseErrors = require('mongoose-errors');
// post schema
const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  //name: { type: String, required: true },
  //username: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: [{ type: String }],
  usersDisliked: [{ type: String }],
});

postSchema.plugin(MongooseErrors);
module.exports = mongoose.model('Post', postSchema);
