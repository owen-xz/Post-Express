var express = require('express');
const postController = require('../controller/post')

var router = express.Router();

/* GET users listing. */
router.get('/posts/', postController.getPosts)
router.post('/post/', postController.createPost)
router.delete('/posts/', postController.deletePosts)
router.delete('/post/:id', postController.deletePost)
router.patch('/post/:id', postController.editPost)

module.exports = router;
