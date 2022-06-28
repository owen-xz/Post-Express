const Post = require('../model/posts')
const User = require('../model/users')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')

const postController = {
    getPosts: handleErrAsync(async (req, res, next) => {
        const timeSort = req.query.timeSort == "asc" ? 'createdAt' : '-createdAt'
        const keyword = req.query.keyword ? {"contentMessage": new RegExp(req.query.keyword)} : {};
        const posts = await Post.find(keyword)
        .populate({
            path: 'author',
            select: 'name photo'
        })
        .populate({
            path: 'comments.user',
            select: 'name photo'
        })
        .sort(timeSort);
        handleSuccess(res, posts)
    }),
    createPost: handleErrAsync(async (req, res, next) => {
        const { body, userId } = req
        const { contentMessage } = body
        if(!contentMessage || !contentMessage.trim()) {
            return next(appErr(400, '請輸入貼文內容', next))
        }
        const sendPost = {
            ...body,
            author: userId
        }
        await Post.create(sendPost)
        handleSuccess(res, '')
    }),
    deletePosts: handleErrAsync(async (req, res, next) => {
        await Post.deleteMany({})
        handleSuccess(res, '')
    }),
    deletePost: handleErrAsync(async (req, res, next) => {
        const { postId } = req.params
        const post = await Post.findByIdAndDelete(postId)
        if(!post) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    editPost: handleErrAsync(async (req, res, next) => {
        const { body, params } = req
        const { contentMessage } = body
        const { postId } = params
        if(!contentMessage || !contentMessage.trim()) {
            return next(appErr(400, '請輸入貼文內容', next))
        }
        const post = await Post.findByIdAndUpdate(postId, body)
        if(!post) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    likePost: handleErrAsync(async (req, res, next) => {
        const { userId, params } = req
        const { postId } = params
        const isLiked = (await Post.find({
            _id: postId,
            'likes': {
              $in: [ userId ]
            }
        })).length
        if(isLiked) {
            return next(appErr(400, '已按讚此 postId', next))
        }
        const post = await Post.findByIdAndUpdate(postId, {
            $addToSet: {
                likes: userId
            }
        })
        if(!post) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    unlikePost: handleErrAsync(async (req, res, next) => {
        const { userId, params } = req
        const { postId } = params
        const isLiked = (await Post.find({
            _id: postId,
            'likes': {
              $in: [ userId ]
            }
        })).length
        if(!isLiked) {
            return next(appErr(400, '尚未按讚此 postId', next))
        }
        const post = await Post.findByIdAndUpdate(postId, {
            $pull: {
                likes: userId
            }
        })
        if(!post) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    }),
    userPosts: handleErrAsync(async (req, res, next) => {
        const { userId } = req.params
        const post = await Post.find({
            author: userId
        })
        .populate({
            path: 'author',
            select: 'name photo'
        })
        .populate({
            path: 'comments.user',
            select: 'name photo'
        })
        if(!post) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, post)
    }),
    postComment: handleErrAsync(async (req, res, next) => {
        const { userId, params, body } = req
        const { postId } = params
        const { commentMessage } = body
        if(!commentMessage || !commentMessage.trim()) {
            return next(appErr(400, 'commentMessage 不可為空', next))
        }
        const post = await Post.findByIdAndUpdate(postId, {
            $addToSet: {
                comments: {
                    user: userId,
                    commentMessage
                }
            }
        })
        if(!post) {
            return next(appErr(400, '查無此 Id！', next))
        }
        handleSuccess(res, '')
    })
}
module.exports = postController