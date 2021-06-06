const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectName: {
        type: String,
        require: true
    },
    owner: {
        type :Schema.Types.ObjectId,
        ref: 'user', 
        require: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    createAt: {
        type: Date,
        default: new Date()
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'task'
    }]
})

mongoose.model('project', projectSchema);