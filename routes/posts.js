var express = require('express');
const postController = require('../controller/post')
const { isAuth } = require('../handler/auth')

var router = express.Router();

/* GET users listing. */
router.get('/posts/', isAuth, postController.getPosts)
router.post('/post/', isAuth, postController.createPost)
router.delete('/posts/', isAuth, postController.deletePosts)
router.delete('/post/:postId', isAuth, postController.deletePost)
router.patch('/post/:postId', isAuth, postController.editPost)
router.post('/post/:postId/like', isAuth, postController.likePost)
router.delete('/post/:postId/unlike', isAuth, postController.unlikePost)
router.get('/posts/user/:userId', isAuth, postController.userPosts)
router.post('/posts/:postId/comment', isAuth, postController.postComment)

module.exports = router;
