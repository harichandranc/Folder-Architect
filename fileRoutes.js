const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../models/File');

// storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// upload
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = new File({
    name: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
    folderId: req.body.folderId || null
  });

  await file.save();
  res.json(file);
});

// get files (delay simulation)
router.get('/', async (req, res) => {
  setTimeout(async () => {
    const files = await File.find();
    res.json(files);
  }, 2000);
});

// COPY (duplicate)
router.post('/copy/:id', async (req, res) => {
  const isBusy = Math.random() < 0.5;

  if (isBusy) {
    return res.status(500).json({
      message: "Retrieving data. Wait a few seconds and try again."
    });
  }

  const file = await File.findById(req.params.id);

  const newFile = new File({
    name: file.name,
    path: file.path,
    size: file.size,
    folderId: file.folderId
  });

  await newFile.save();
  res.json(newFile);
});

// MOVE (cut)
router.put('/move/:id', async (req, res) => {
  const isBusy = Math.random() < 0.5;

  if (isBusy) {
    return res.status(500).json({
      message: "Retrieving data. Try again."
    });
  }

  const file = await File.findByIdAndUpdate(
    req.params.id,
    { folderId: req.body.folderId },
    { new: true }
  );

  res.json(file);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await File.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
