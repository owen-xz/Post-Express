const mongoose = require('mongoose')

const user = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, 'name 必填']
        },
        email: {
            type: String,
            required: [true, 'email 必填'],
            unique: true,
            lowercase: true,
            select: false
        },
        photo: {
            type: String
        },
        password: {
            type: String,
            required: [true, 'password 必填'],
            select: false
        },
        gender: {
            type: String,
            enum: ['1', '0'],
            required: [true, 'gender 必填']
        }
    },
    {
        versionKey: false
    }
)
const User = mongoose.model('user', user)

module.exports = User