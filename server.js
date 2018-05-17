const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});

const upload = multer({ storage: storage });

const port = process.env.PORT || 5000;
const app = express();

const ObjectID = require("mongoose").ObjectID;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://localhost/blog");

// mongoose.connect("mongodb://sid:admin@ds223760.mlab.com:23760/blog-api");

const db = mongoose.connection;

const blog_schema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    body: String,
    author: String,
    comments: [
      {
        body: String,
        created_at: Date
      }
    ],
    hidden: Boolean,
    tags: [],
    image: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Blog = mongoose.model("Blog", blog_schema);

app.post("/", upload.single("testImage"), function(req, res) {
  const newBlog = new Blog({
    image: req.file.path,
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
    hidden: req.body.hidden,
    tags: req.body.tags
  });
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

app.put("/blog/:id", upload.single("testImage"), function(req, res) {
  const id = req.params.id;
  const details = { _id: id };
  
  const updatedBlog = {
    $set: {
          title: req.body.title,
          body: req.body.body,
          author: req.body.author,
          hidden: req.body.hidden,
    },
    $push: { tags: { $each: req.body.tags } }
  };

  Blog.update(details, updatedBlog, function(err, result) {
    if (err) res.send(err);

    res.json(updatedBlog);

    console.log(result);
  });
});

app.put("/blog/:id/comment", function(req, res) {
  const id = req.params.id;
  const details = { _id: id };
  const comments = { body: req.body.commentBody, created_at: new Date() };
  const addComment = {
    $push: { comments: { $each: [comments] } }
  };

  Blog.findOneAndUpdate(details, addComment, function(err, result) {
    if (err) res.send(err);

    res.json(result);

    console.log(addComment);
  });
});

app.get("/", function(req, res) {
  res.send("Welcome to the blog API").status(200);
});

app.listen(process.env.PORT || 3000, function() {
  console.log(`Server started on ${process.env.PORT || 3000}`);
});
