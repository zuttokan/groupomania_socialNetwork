// call the model post
const Post = require('../models/post');
// fs, for modify the file system, including the functions to delete
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Add a post
exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post);
  delete postObject._id;
  const post = new Post({
    ...postObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  post
    .save()
    .then(() => res.status(201).json({ message: 'registered object !' }))
    .catch((error) => res.status(400).json({ error }));
};

// accesses a post
exports.getOnePost = (req, res, next) => {
  Post.findOne({
    _id: req.params.id,
  })
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Modify a post
exports.modifyPost = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;

  const postObject = req.file
    ? {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post.userId == userId) {
        Post.updateOne(
          { _id: req.params.id },
          { ...postObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Modify object !' }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(403).json({ message: 'Forbidden request !' });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// remove a post
exports.deletePost = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;

  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (post.userId == userId) {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'deleted object !' }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        res.status(403).json({ message: 'Forbidden request !' });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// accesses all posts
exports.getAllPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//like and dislike
exports.likePost = (req, res, next) => {
  const like = req.body.like;
  if (like === 1) {
    // button like
    Post.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id,
      }
    )
      .then(() => res.status(200).json({ message: 'Vous aimez ce post' }))
      .catch((error) => res.status(400).json({ error }));
  } else if (like === -1) {
    // button dislike
    Post.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id,
      }
    )
      .then(() => res.status(200).json({ message: 'Vous n’aimez pas ce post' }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    // cancel the button like or dislike
    Post.findOne({ _id: req.params.id })
      .then((post) => {
        if (post.usersLiked.indexOf(req.body.userId) !== -1) {
          Post.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
              _id: req.params.id,
            }
          )
            .then(() =>
              res.status(200).json({ message: 'Vous n’aimez plus ce post' })
            )
            .catch((error) => res.status(400).json({ error }));
        } else if (post.usersDisliked.indexOf(req.body.userId) !== -1) {
          Post.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id,
            }
          )
            .then(() =>
              res.status(200).json({
                message: 'Vous aimerez peut-être ce post à nouveau',
              })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
