const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const app = express();

const ObjectID = require("mongoose").ObjectID;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connect("mongodb://localhost/blog");

mongoose.connect("mongodb://sid:admin@ds223760.mlab.com:23760/blog-api");

const db = mongoose.connection;

const blog_schema = new mongoose.Schema(
  {
    title: String,
    body: String,
    author: String,
    comments: [
      {
        body: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    hidden: Boolean,
    tags: []
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

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
  newBlog.save(function(err, savedBlog) {
    if (err) res.send(err);
    res.json(savedBlog);
  });
});

app.get("/blog/:id", function(req, res) {
  const id = req.params.id;
  const details = { _id: id };

  Blog.findById(details, function(err, fetchedBlog) {
    if (err) res.send(err);
    res.json(fetchedBlog);
  });
});

app.put("/blog/:id", function(req, res) {
  const id = req.params.id;
  const details = { _id: id };
  const updatedBlog = {
    $set: req.body
  };

  Blog.update(details, updatedBlog, function(err, result) {
    if (err) res.send(err);

    res.json(updatedBlog);

    console.log(result);
  });
});

app.get("/", function(req, res) {
  res.send("Welcome to the blog API").status(200);
});

app.listen(process.env.PORT || 3000, function() {
  console.log(`Server started on ${process.env.PORT || 3000}`);
});
