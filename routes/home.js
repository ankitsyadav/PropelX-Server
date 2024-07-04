const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to PropelX-CLUB Server API!');
});

module.exports = router;
