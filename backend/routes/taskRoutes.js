// taskRoutes.js
const express = require('express');
const mongoose = require('mongoose'); // Add this line
const Task = require('../models/Task');
const router = express.Router();

// Get all tasks for a specific user
router.get('/tasks/:userId', async (req, res) => {
    try {
        // Validate userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        const tasks = await Task.find({ userId: req.params.userId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task
router.post('/tasks', async (req, res) => {
    try {
        const { title, description, dueDate, priority, userId } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid userId format' });
        }
        
        const task = new Task({
            title,
            description,
            dueDate: dueDate || null,
            priority: priority || 'Green',
            userId: new mongoose.Types.ObjectId(userId)
        });
        
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
    try {
        // Validate task ID is valid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid task ID format' });
        }

        const { title, description, dueDate, priority, completed } = req.body;
        
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                dueDate,
                priority,
                completed: completed || false
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ message: err.message });
    }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    try {
        // Validate task ID is valid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid task ID format' });
        }

        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;