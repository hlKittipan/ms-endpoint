const express = require('express')
var cors = require("cors");
var mongoose = require("mongoose");

var mongo_uri = "mongodb+srv://devoatnaja:wq65z5CjqDxqOdD5@cluster0.yqxra.gcp.mongodb.net/vuenuxt01?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;
mongoose.connect(mongo_uri, { useNewUrlParser: true , useUnifiedTopology: true}).then(
  () => {
    console.log("[success] task 2 : connected to the database ");
  },
  error => {
    console.log("[failed] task 2 " + error);
    process.exit();
  }
);

const app = express()

app.use(cors());

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(3000, () => {
  console.log('Start server at port 3000.')
})

// path สำหรับ MongoDB ของเรา
var POSTS = require("./route/posts");
app.use("/api/posts", POSTS);

app.use((req, res, next) => {
  var err = new Error("ไม่พบ path ที่คุณต้องการ");
  err.status = 404;
  next(err);
});

const posts = require('./db.json')

app.get('/posts', (req, res) => {
  res.json(posts)
})

app.get('/posts/:id', (req, res) => {
  res.json(posts.find(post => post.id === req.params.id))
})

app.post('/posts', (req, res) => {
  posts.push(req.body)
  res.status(201).json(req.body)
})

app.put('/posts/:id', (req, res) => {
  const updateIndex = posts.findIndex(post => post.id === req.params.id)
  res.json(Object.assign(posts[updateIndex], req.body))
})

app.delete('/posts/:id', (req, res) => {
  const deletedIndex = posts.findIndex(post => post.id === req.params.id)
  posts.splice(deletedIndex, 1)
  res.status(204).send()
})