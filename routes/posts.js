var express = require('express');
const handleSuccess = require('../handler/handleSuccess')
const handleErr = require('../handler/handleErr')
const postController = require('../controller/post')

var router = express.Router();

/* GET users listing. */
router.get('/', postController.getPosts)
router.post('/', postController.createPost)
router.delete('/', postController.deletePosts)
router.delete('/:id', postController.deletePost)
router.patch('/:id', postController.editPost)

module.exports = router;
