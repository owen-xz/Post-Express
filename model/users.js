const mongoose = require('mongoose')

const user = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, 'name 必填']
        },
        email: {
            type: String,
            required: [true, 'Email 必填'],
            unique: true,
            lowercase: true,
            select: false
        },
        photo: {
            type: String
        }
    },
    {
        versionKey: false
    }
)
const User = mongoose.model('user', user)

module.exports = User