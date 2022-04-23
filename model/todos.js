const mongoose = require('mongoose')

const todos = new mongoose.Schema(
    {
        title: {
            type: String,
            require: [true, 'title 必填']
        },
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
const Todos = mongoose.model('Todos', todos)

module.exports = Todos