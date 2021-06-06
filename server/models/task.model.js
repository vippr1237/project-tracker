const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskName: {
        type: String,
        require: true
    },
    list: [{
        work: {
            type: String,
            require: true
        }, 
        status: {
            type: Boolean,
            default: false
        }
    }],
    status: {
        type: Boolean,
        default: false
    },
    assignTo: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    assignBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    dateDue: {
        type: Date
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    createAt: {
        type: Date,
        default: new Date()
    }
});

mongoose.model('task', taskSchema);