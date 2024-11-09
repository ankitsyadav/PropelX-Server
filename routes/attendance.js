// routes/attendance.js
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/UserModel'); // Assuming Student model exists

// Route to search students by college, batch, and class
router.get('/search', async (req, res) => {
    const { college, batch, className } = req.query;
    try {
        const students = await Student.find({ college, batch, className });
        res.status(200).json({ students });
    } catch (error) {
        console.error('Error fetching student list:', error);
        res.status(500).json({ error: 'Failed to fetch student list' });
    }
});

// Route to mark attendance for a specific class session
router.post('/mark', async (req, res) => {
    const { college, batch, className, date, time, students,markedBy } = req.body;

    if (!college || !batch || !className || !date || !time || !students || !markedBy) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const attendance = new Attendance({
            college,
            batch,
            className,
            date,
            time,
            students,
            markedBy
        });

        await attendance.save();
        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
});

// Route to retrieve attendance records for a specific class and time
router.get('/', async (req, res) => {
    const { college, batch, className, date, time } = req.query;

    try {
        const attendance = await Attendance.findOne({
            college,
            batch,
            className,
            date,
            time
        }).populate('students.studentId', 'name'); // Populate student names

        if (!attendance) {
            return res.status(404).json({ message: 'No attendance records found' });
        }

        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance record:', error);
        res.status(500).json({ error: 'Failed to fetch attendance record' });
    }
});

module.exports = router;
