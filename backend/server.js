// Load env variables
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// Import dependencies
const Post = require("./models/post");
const { uploadFile, deleteFile, getObjectSignedUrl } = require('./s3.js');
const express = require("express");
const cors = require("cors");
const connectToDb = require("./config/connectToDb");
const postsController = require("./controllers/postsController");
const commentController = require("./controllers/commentController");
const userController = require('./controllers/userController');
const multer  = require('multer');
const sharp = require("sharp");
const crypto = require("crypto");
const storage = multer.memoryStorage()
const upload = multer();

// Create an express app
const app = express();

// Configure express app
app.use(express.json());
app.use(cors());

// Connect to database
connectToDb();

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// Routing
app.get("/comment/:postId", commentController.fetchCommentsByPost);
app.get("/comment/:user", commentController.fetchCommentbyUser);
app.get("/comment/:id", commentController.fetchComment);
app.get("/comments/post/:postId", commentController.fetchCommentsByPost);
app.get("/comments/user/:user", commentController.fetchCommentbyUser);
app.get("/comments/:id", commentController.fetchComment);

app.post("/comment/:postId", commentController.createComment);
app.put("/comment/:id", commentController.updateComment);
app.delete("/comment/:id", commentController.deleteComment);
app.get("/users/:user", userController.fetchUser);
app.get("/users", userController.fetchUsers);
app.put("/users/:user", upload.single('file'), userController.updateUser);
app.get("/post", postsController.fetchPosts);
app.get("/posts/:user", postsController.fetchPostbyUser);
app.get("/post/:id", postsController.fetchPost);
app.put("/post/:id", postsController.updatePost);
app.put("/likepost/:id", postsController.likePost);
app.delete("/post/:id", postsController.deletePost);
app.post('/signup', userController.signup);
app.post('/signin', userController.signin);
app.post("/post", upload.single('file'),  async (req, res) => {
  // Get the sent in data off request body
  let { name, body } = req.body;
  const date = Date.now();
  var imageName = generateFileName();
  let likes = new Array (name);
  var post;

  if(req.file){
      const fileBuffer = await sharp(req.file.buffer)
    .resize({ width: 480 })
    .toBuffer()

  await uploadFile(fileBuffer, imageName, req.file.mimetype)

  // Create a Post with it
  post = await Post.create({
    name,
    body,
    imageName,
    likes,
    date,
  });
  }
  else{
    imageName = "noImage";
 post = await Post.create({
    name,
    body,
    imageName,
    likes,
    date,
  });
  }
  // respond with the new Post
  res.json({ post });
});


// Start our server
app.listen(process.env.PORT);
