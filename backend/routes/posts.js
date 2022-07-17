// framework for created API
const express = require('express');
// create a new router object in your program to handle requests.
const router = express.Router();
// process for verify the identity of a user
const auth = require('../middleware/auth');
// multer, is used for uploading files
const multer = require('../middleware/multer-config');

const postsCtrl = require('../controllers/posts');

router.post('/', auth, multer, postsCtrl.createPost);

router.put('/:id', auth, multer, postsCtrl.modifyPost);
router.delete('/:id', auth, postsCtrl.deletePost);
router.post('/:id/like', auth, postsCtrl.likePost);

router.get('/', auth, postsCtrl.getAllPosts);
router.get('/:id', auth, postsCtrl.getOnePost);

module.exports = router;
