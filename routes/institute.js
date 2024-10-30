const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Institute = require('../models/InstituteModel');
const User = require('../models/UserModel');

// POST /institutes to create a new institute
router.post('/institutes', async (req, res) => {
  try {
    const { instituteName, instituteLocation } = req.body;
    const newInstitute = new Institute({
      instituteName,
      instituteLocation,
    });
    await newInstitute.save();
    res.status(201).json({ message: "Institute created successfully", institute: newInstitute });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET /institutes to get all institutes
router.get('/institutes', async (req, res) => {
  try {
    const institutes = await Institute.find();
    if (!institutes) return res.status(404).send("No institutes found");
    res.status(200).json({ institutes });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET /institutes/:id to get a specific institute by id
router.get('/institutes/:id', async (req, res) => {
  try {
    const instituteId = req.params.id;
    const institute = await Institute.findById(instituteId);
    if (!institute) return res.status(404).send("Institute not found");
    res.status(200).json({ institute });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// PUT /institutes/:id to update a specific institute
router.put('/institutes/:id', async (req, res) => {
  try {
    const instituteId = req.params.id;
    const { instituteName, instituteLocation } = req.body;
    const institute = await Institute.findByIdAndUpdate(instituteId, {
      instituteName,
      instituteLocation,
    }, { new: true });
    if (!institute) return res.status(404).send("Institute not found");
    res.status(200).json({ message: "Institute updated successfully", institute });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// DELETE /institutes/:id to delete a specific institute
router.delete('/institutes/:id', async (req, res) => {
  try {
    const instituteId = req.params.id;
    const institute = await Institute.findByIdAndDelete(instituteId);
    if (!institute) return res.status(404).send("Institute not found");
    res.status(200).json({ message: "Institute deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// POST /institutes/:id/students to add a student to a specific institute
router.post('/institutes/:id/students', async (req, res) => {
  try {
    const instituteId = req.params.id;
    const studentId = req.body.studentId;

    const institute = await Institute.findById(instituteId);
    if (!institute) return res.status(404).send("Institute not found");

    const student = await User.findById(studentId);
    if (!student) return res.status(404).send("Student not found");

    institute.students.push(student);
    await institute.save();
    res.status(200).json({ message: "Student added to institute successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
