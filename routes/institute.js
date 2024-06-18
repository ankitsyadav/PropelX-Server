const router = require("express").Router();
const Institute = require('../models/InstituteModel');

// Route to add an institute
router.post('/add', async (req, res) => {
  try {
    const { name, instituteId } = req.body;
    const newInstitute = new Institute({ name, instituteId });
    await newInstitute.save();
    res.status(201).json(newInstitute);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to list all institutes
router.get('/list', async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.status(200).json(institutes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
