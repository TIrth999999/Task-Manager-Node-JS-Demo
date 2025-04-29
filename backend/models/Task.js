// Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    addDate: { type: Date, default: Date.now },
    dueDate: Date,
    priority: { 
        type: String, 
        enum: ['Red', 'Yellow', 'Green'], 
        default: 'Green' 
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Task', taskSchema);