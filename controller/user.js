const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../model/users')
const handleSuccess = require('../handler/handleSuccess')
const appErr = require('../handler/appError')
const handleErrAsync = require('../handler/handleErrAsync')
const { generateSendJWT } = require('../handler/auth')
const handleErrorAsync = require('../handler/handleErrAsync')

const userController = {
  signUp: handleErrAsync(async(req, res, next) => {
    const { name, email, password } = req.body
    if(!name || !name.trim()) {
      return next(appErr(400, '請輸入 name', next))
    }
    if(!validator.isLength(name, {max: 12})) {
      return next(appErr(400, 'name 長度限制 12 字元', next))
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
    if(!validator.isLength(password, {min: 6, max: 12})) {
      return next(appErr(400, 'password 長度限制 6～12 字元', next))
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
  patchUserProfile: handleErrorAsync(async(req, res, next) => {
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
  })
}
module.exports = userController
