const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['To-Do', 'In Progress', 'Under Review', 'Finished'],
        default: 'To-Do'
    },
    priority: {
        type: String
    },
    deadline: {
        type: Date
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);
