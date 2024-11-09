// routes/attendance.js
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/UserModel'); // Assuming Student model exists

// Route to search students by college, batch, and class
router.get('/search', async (req, res) => {
    const { college, batch, className } = req.query;
    try {
        const students = await User.find({ college, batch, className });
        res.status(200).json({ students });
    } catch (error) {
        console.error('Error fetching student list:', error);
        res.status(500).json({ error: 'Failed to fetch student list' });
    }
});

// Route to mark attendance for a specific class session
// Route to mark attendance for a specific class session
router.post('/mark', async (req, res) => {
    const { college, batch, className, date, time, students, markedBy } = req.body;

    if (!college || !batch || !className || !date || !time || !students || !markedBy) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Iterate through the students and update their 'present' status in the User model
        const updatedStudents = await Promise.all(
            students.map(async (student) => {
                const user = await User.findOne({ _id: student.studentId });  // Correct model: User
                if (!user) {
                    throw new Error(`Student with ID ${student.studentId} not found.`);
                }

                // Update the 'present' field for the student
                user.present = student.present; // Update based on input (true/false)
                await user.save(); // Save updated student record
                return { studentId: user._id, present: user.present };
            })
        );

        // Create the attendance record in the Attendance model
        const attendance = new Attendance({
            college,
            batch,
            className,
            date,
            time,
            students: updatedStudents,
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
// Route to search students by college, batch, and class
router.get('/search', async (req, res) => {
    const { college, batch, className } = req.query;

    try {
        // Fetch attendance for the given parameters
        const attendance = await Attendance.findOne({ college, batch, className });

        if (!attendance) {
            return res.status(404).json({ message: 'No attendance records found' });
        }

        // Add attendance status to student data
        const studentsWithAttendance = attendance.students.map(async student => {
            const studentDetails = await Student.findById(student.studentId);
            return {
                ...studentDetails.toObject(),
                present: student.present
            };
        });

        res.status(200).json({ students: studentsWithAttendance });
    } catch (error) {
        console.error('Error fetching student list with attendance:', error);
        res.status(500).json({ error: 'Failed to fetch student list with attendance' });
    }
});


module.exports = router;
