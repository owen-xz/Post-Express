var express = require('express');
const postController = require('../controller/post')
const { isAuth } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('/posts/', isAuth, postController.getPosts)
router.post('/post/', isAuth, postController.createPost)
router.delete('/posts/', isAuth, postController.deletePosts)
router.delete('/post/:id', isAuth, postController.deletePost)
router.patch('/post/:id', isAuth, postController.editPost)

module.exports = router;
