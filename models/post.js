const { request } = require("express");
const mongoose = require("mongoose");
const timestamp = require('mongoose-timestamp')


var postSchema = mongoose.Schema({
  // กำหนด ชื่อและชนิดของ document เรา
  title: {
    type: String,
    request: true
  },
  content: {
    type: String,
    request: true
  },
  tag: {},
  category: {},
  author: {
    type: String,
    request: true
  },
  status: {
    type: Number ,
  },
  image: {},
  user_id:{
    type: String
  }
}, {
  // กำหนด collection ของ MongoDB หรือจะไม่กำหนดก็ได้
  collection: "POSTS"
});

// ถ้าไม่ได้กำหนด collection ข้างบน default จะเป็น "post"
var posts = mongoose.model("posts", postSchema);
module.exports = posts;