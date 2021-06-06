const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: {
        type: String,
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    createAt: {
        type: Date,
        default: new Date()
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'task'
    }
})

mongoose.model('comment', commentSchema);


