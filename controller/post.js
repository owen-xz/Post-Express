const Post = require('../model/posts')
const User = require('../model/users')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
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
        const post = await Post.findByIdAndDelete(id)
        if(!post) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    editPost: handleErrAsync(async (req, res, next) => {
        const { body } = req
        const { contentMessage } = body
        const { id } = req.params
        if(!contentMessage || !contentMessage.trim()) {
            return next(appErr(400, '請輸入貼文內容', next))
        }
        const post = await Post.findByIdAndUpdate(id, body)
        if(!post) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    })
}
module.exports = postController