const Post = require('../model/posts')
const User = require('../model/users')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appError')
const handleErrAsync = require('../handler/handleErrAsync')

const postController = {
    getPosts: handleErrAsync(async (req, res, next) => {
        const timeSort = req.query.timeSort == "asc" ? 'createdAt' : '-createdAt'
        const keyword = req.query.keyword ? {"contentMessage": new RegExp(req.query.keyword)} : {};
        const posts = await Post.find(keyword).populate({
            path: 'author',
            select: 'name photo'
        }).sort(timeSort);
        handleSuccess(res, posts)
    }),
    createPost: handleErrAsync(async (req, res, next) => {
        const { body } = req
        const { contentMessage, author } = body
        if(!contentMessage || !contentMessage.trim()) {
            return appErr(400, '請輸入貼文內容', next)
        }
        if(!author) {
            return appErr(400, '請輸入使用者 Id', next)
        }
        await User.findById(author)
        const post = await Post.create(body)
        handleSuccess(res, post)
    }),
    deletePosts: handleErrAsync(async (req, res, next) => {
        await Post.deleteMany({})
        handleSuccess(res, [])
    }),
    deletePost: handleErrAsync(async (req, res, next) => {
        const { id } = req.params
        const post = await Post.findByIdAndDelete(id)
        handleSuccess(res, post)
    }),
    editPost: handleErrAsync(async (req, res, next) => {
        const { body } = req
        const { contentMessage } = body
        const { id } = req.params
        if(!contentMessage || !contentMessage.trim()) {
            return next(appErr(400, '請輸入貼文內容', next))
        }
        const post = await Post.findByIdAndUpdate(id, body)
        handleSuccess(res, post)
    })
}
module.exports = postController