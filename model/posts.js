const mongoose = require('mongoose')

const post = new mongoose.Schema(
    {
        contentMessage: {
            type: String,
            require: [true, 'message 必填']
        },
        contentImage: {
            type: String
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
            require: [true, 'author 必填']
        },
        likes: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'user'
            }
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'user'
                },
                commentMessage: {
                    type: String
                }
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now,
            select: false
        }
    },
    {
        versionKey: false
    }
)
const Post = mongoose.model('post', post)

module.exports = Post