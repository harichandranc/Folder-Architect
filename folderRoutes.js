const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');

// create folder
router.post('/', async (req, res) => {
  const folder = new Folder(req.body);
  await folder.save();
  res.json(folder);
});

// get folders
router.get('/', async (req, res) => {
  const folders = await Folder.find();
  res.json(folders);
});

module.exports = router;
