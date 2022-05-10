const Post = require('../model/posts')
const handleSuccess = require('../handler/handleSuccess')
const handleErr = require('../handler/handleErr')

const postController = {
    async getPosts(req, res) {
        const posts = await Post.find()
        handleSuccess(res, posts)
    },
    async createPost(req, res) {
        try {
            const { contentMessage, author } = req.body
            if(contentMessage && author) {
                await Post.create(
                    {
                        contentMessage,
                        author
                    }
                )
                postController.getPosts(req, res)
            } else {
                handleErr(res)
            }
          } catch (err) {
            handleErr(res)
          }
    },
    async deletePosts(req, res) {
        const posts = await Post.deleteMany({})
        handleSuccess(res, posts)
    },
    async deletePost(req, res) {
        try {
            const { id } = req.params
            const post = await Post.findByIdAndDelete(id)
            if(post) {
                postController.getPosts(req, res)
            } else {
                handleErr(res)
            }
        } catch (err) {
            handleErr(res)
        }
    },
    async editPost(req, res) {
        try {
            const { body } = req
            const { contentMessage } = body
            const { id } = req.params
            if(contentMessage) {
                const post = await Post.findByIdAndUpdate(id, body)
                if(post) {
                    postController.getPosts(req, res)
                } else {
                    handleErr(res)
                }
            } else {
                handleErr(res)
            }
        } catch (err) {
            handleErr(res)
        }
    }
}
module.exports = postController