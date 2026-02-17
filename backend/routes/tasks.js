const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// 1. GET Tasks (Updated Visibility Rule)
router.get('/', auth, async (req, res) => {
    try {
        const { search } = req.query;

        // Base Query: Admin sees all. 
        // Regular users see: Their OWN tasks OR Any COMPLETED task.
        let query = {};

        if (req.user.role !== 'admin') {
            query.$or = [
                { user: req.user.id },       // My tasks (pending or completed)
                { status: 'completed' }      // Everyone else's completed tasks
            ];
        }

        // Add Search Filter if exists
        if (search) {
            // We combine the visibility rule with the search rule
            query = {
                $and: [
                    query, // The visibility rules above
                    { title: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .populate('user', 'username');

        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// 2. CREATE Task
router.post('/', auth, async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id,
            status: 'pending'
        });
        const task = await newTask.save();
        await task.populate('user', 'username');
        res.json(task);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 3. UPDATE Task (Admin Confirms OR Owner Edits)
router.put('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        const isAdmin = req.user.role === 'admin';
        const isOwner = task.user.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        // Admin Action: Change Status
        if (isAdmin && req.body.status) {
            task.status = req.body.status;
        }

        // Owner Action: Edit Content
        if (isOwner && (req.body.title || req.body.description)) {
            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;

            // Reset to pending if content changed (so Admin has to check it again)
            if (!isAdmin) {
                task.status = 'pending';
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, { $set: task }, { returnDocument: 'after' }).populate('user', 'username');
        res.json(updatedTask);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 4. DELETE Task
router.delete('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        const isAdmin = req.user.role === 'admin';
        const isOwner = task.user.toString() === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ msg: 'Access Denied' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;