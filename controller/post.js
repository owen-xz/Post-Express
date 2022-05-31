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
            return next(appErr(400, '請輸入貼文內容', next))
        }
        if(!author) {
            return next(appErr(400, '請輸入使用者 Id', next))
        }
        await User.findById(author)
        await Post.create(body)
        handleSuccess(res, '')
    }),
    deletePosts: handleErrAsync(async (req, res, next) => {
        await Post.deleteMany({})
        handleSuccess(res, '')
    }),
    deletePost: handleErrAsync(async (req, res, next) => {
        const { id } = req.params
        await Post.findByIdAndDelete(id)
        handleSuccess(res, '')
    }),
    editPost: handleErrAsync(async (req, res, next) => {
        const { body } = req
        const { contentMessage } = body
        const { id } = req.params
        if(!contentMessage || !contentMessage.trim()) {
            return next(appErr(400, '請輸入貼文內容', next))
        }
        await Post.findByIdAndUpdate(id, body)
        handleSuccess(res, '')
    })
}
module.exports = postController