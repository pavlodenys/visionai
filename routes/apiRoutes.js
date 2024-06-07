const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { detectObjects } = require('../services/objectDetection');

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});

const upload = multer({ storage: storage });

router.post('/detect', upload.single('frame'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const imageBuffer = fs.readFileSync(req.file.path);
    const predictions = await detectObjects(imageBuffer);
    fs.unlinkSync(req.file.path); // Delete the image file after detection
    res.json(predictions);
  } catch (error) {
    console.error('Error processing the frame:', error.stack);
    res.status(500).send('Error processing the frame.');
  }
});

module.exports = router;