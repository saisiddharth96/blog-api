const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); 
const port = process.env.PORT || 5000;
const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const blog_model = require("./blog_schema.js");

// mongoose.connect("mongodb://localhost/blog");

mongoose.connect("mongodb://sid:admin@ds223760.mlab.com:23760/blog-api");

const db = mongoose.connection;

const blog_schema = new mongoose.Schema({
  title: String,
  body: String,
  author: String,
  comments: [
    {
      body: String,
      createdAt : {
        type : Date,
        default : Date.now
      }
    }
  ],
  hidden: Boolean,
  createdAt: {
    type : Date,
    default : Date.now
  },
  lastUpdated: {
    type : Date,
    default : Date.now()
  },
  tags: []
});

const Blog = mongoose.model("Blog", blog_schema);

db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function() {
//   console.log("Connected to Database!");
  // const newBlog = new Blog({
  //   title: "Test blog title",
  //   body: "Consequat sunt duis anim culpa eu. Veniam ad esse proident voluptate quis tempor velit Lorem. Ad ipsum consequat quis excepteur est. Aliquip anim tempor labore dolore amet incididunt minim. Ad ea aute laboris labore exercitation aute.",
  //   author: "Fugiat anim ut officia id enim pariatur nostrud.",
  //   comments: [
  //     {
  //       body: "Sint veniam anim sunt anim reprehenderit aliqua deserunt fugiat.",
  //       date: new Date()
  //     }
  //   ],
  //   hidden: false,
  //   createdAt: new Date(),
  //   lastUpdated: null,
  //   tags: ["test", "testing"]
  // });

//   newBlog.save(function(err,newBlog){
//     if(err) console.log(err);
//     console.log("Saved Success");
//   });

// });

app.post("/", function(req, res) {
  const newBlog = new Blog(req.body);
  newBlog.save(function(err,savedBlog){
    if(err) res.send(err);
    res.json(savedBlog);
  })
});

app.get("/", function(req, res) {
  res.send("Welcome to the blog API").status(200);
});

app.listen(process.env.PORT || 3000, function() {
  console.log(`Server started on ${process.env.PORT || 3000}`);
});
