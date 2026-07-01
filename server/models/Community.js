const mongoose = require('mongoose');


const communitySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    },
  userAdmins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: `User`,
    }],
  coverImage: {
    type: String,
    },
  icon: {
    type: String,
    },
  chatsChannel: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: `Chats`,
    required: true
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: `Post`,
    required: true
  }],
});

const community = mongoose.model("community", communitySchema);

module.exports = community;
