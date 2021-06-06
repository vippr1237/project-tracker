const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    email : {
        type: String,
        require: true
    },
    name: {
        type: String
    },
    project: [{
        type: Schema.Types.ObjectId,
        ref: 'group'
    }],
    task: [{
        type: Schema.Types.ObjectId,
        ref: 'task'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    createAt: {
        type: Date,
        default: new Date()
    }
})

mongoose.model('user', userSchema)