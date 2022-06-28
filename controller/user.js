const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../model/users')
const Post = require('../model/posts')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appErr')
const handleErrAsync = require('../handler/handleErrAsync')
const { generateSendJWT } = require('../handler/auth')

const userController = {
  signUp: handleErrAsync(async(req, res, next) => {
    const { name, email, password } = req.body
    if(!name || !name.trim()) {
      return next(appErr(400, '請輸入 name', next))
    }
    if(!validator.isLength(name, {min: 2, max: 12})) {
      return next(appErr(400, 'name 長度限制 2～12 字元', next))
    }
    if(!email) {
      return next(appErr(400, '請輸入 email', next))
    }
    if(!validator.isEmail(email)) {
      return next(appErr(400, 'email 格式錯誤', next))
    }
    const existUser = await User.findOne({ email })
    if(existUser) {
      return next(appErr(400, '此 email 已註冊過', next))
    }
    if(!password) {
      return next(appErr(400, '請輸入 password', next))
    }
    if(!validator.isAlphanumeric(password)) {
      return next(appErr(400, 'password 格式限制大小寫英文、數字', next))
    }
    if(!validator.isLength(password, {min: 8, max: 12})) {
      return next(appErr(400, 'password 長度限制 8～12 字元', next))
    }
    
    const hashPassword = await bcrypt.hash(password, 12)
    await User.create({
      name,
      email,
      password: hashPassword,
      photo: '',
      gender: '1'
    })
    handleSuccess(res, '')
  }),
  signIn: handleErrAsync(async(req, res, next) => {
    const { email, password } = req.body
    if(!email) {
      return next(appErr(400, '請輸入 email', next))
    }
    if(!password) {
      return next(appErr(400, '請輸入 password', next))
    }
    const user = await User.findOne({ email }).select('+password')
    if(!user) {
      return next(appErr(400, '此 email 尚未註冊', next))
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect) {
      return next(appErr(400, 'password 錯誤', next))
    }
    generateSendJWT(user, res)
  }),
  updatePassword: handleErrAsync(async(req, res, next) => {
    const { newPassword, confirmPassword } = req.body
    if(!newPassword) {
      return next(appErr(400, '請輸入 newPassword', next))
    }
    if(!validator.isAlphanumeric(newPassword)) {
      return next(appErr(400, 'newPassword 格式限制大小寫英文、數字', next))
    }
    if(!validator.isLength(newPassword, {min: 8, max: 12})) {
      return next(appErr(400, 'newPassword 長度限制 8～12 字元', next))
    }
    if(!confirmPassword) {
      return next(appErr(400, '請輸入 comfirmPassword', next))
    }
    if(newPassword !== confirmPassword) {
      return next(appErr(400, 'newPassword 與 comfirmPassword 不相同', next))
    }
    
    const hashPassword = await bcrypt.hash(newPassword, 12)
    await User.findByIdAndUpdate(req.userId, {
      password: hashPassword
    })
    handleSuccess(res, '')
  }),
  getUserProfile: handleErrAsync(async(req, res, next) => {
    const user = await User.findById(req.userId)
    handleSuccess(res, user)
  }),
  patchUserProfile: handleErrAsync(async(req, res, next) => {
    const { body } = req
    const { name, gender, photo } = body
    if(!name) {
      return next(appErr(400, '請輸入 name', next))
    }
    if(!gender) {
      return next(appErr(400, '請輸入 gender', next))
    }
    if(!validator.isIn(gender, ["1", "0"])) {
      return next(appErr(400, 'gender 格式錯誤', next))
    }
    await User.findByIdAndUpdate(req.userId, body)
    handleSuccess(res, '')
  }),
  getLikeList: handleErrAsync(async (req, res, next) => {
    const { userId } = req
    const posts = await Post.find({
      likes: {
        $in: [userId]
      }
    }).populate({
      path: 'author',
      select: 'name photo'
    })
    if(!posts) {
      return next(appErr(400, '查無此 Id！', next))
    }
    handleSuccess(res, posts)
  }),
  getFollows: handleErrAsync(async (req, res, next) => {
    const { userId } = req
    const follows = await User.findById(userId)
    .select('follows')
    .populate({
      path: 'follows.user',
      select: 'name photo'
    })
    handleSuccess(res, follows)
  }),
  postFollow: handleErrAsync(async (req, res, next) => {
    const { userId, params } = req
    const followId = params.userId
    const followUser =  await User.findById(followId)
    if(!followUser) {
      return next(appErr(400, '查無此 Id！', next))
    }
    const isFollowed = (await User.find({
      _id: userId,
      'follows.user': {
        $in: [ followId ]
      }
    })).length
    if(isFollowed) {
      return next(appErr(400, '已追蹤此 userId', next))
    }
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        follows: {
          user: followId
        }
      }
    })
    handleSuccess(res, '')
  }),
  deleteFollow: handleErrAsync(async (req, res, next) => {
    const { userId, params } = req
    const followId = params.userId
    const followUser =  await User.findById(followId)
    if(!followUser) {
      return next(appErr(400, '查無此 Id！', next))
    }
    const isFollowed = (await User.find({
      _id: userId,
      'follows.user': {
        $in: [ followId ]
      }
    })).length
    if(!isFollowed) {
      return next(appErr(400, '尚未追蹤此 userId', next))
    }
    await User.findByIdAndUpdate(userId, {
      $pull: {
        follows: {
          user: followId
        }
      }
    })
    handleSuccess(res, '')
  })
}
module.exports = userController
