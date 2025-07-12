// server/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const protect = require('../middleware/authMiddleware');
const {
  addItem,
  getItems,
  getItemById,
  deleteItem,
  getMyItems,
  getFeaturedItems
} = require('../controllers/itemController');

// Ensure uploads folder exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// 🔧 Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// ✅ Add item with file upload middleware
router.post('/', protect, upload.single('image'), addItem);
router.get('/featured', getFeaturedItems);
router.get('/my-items', protect, getMyItems);
router.get('/', getItems);
router.get('/:id', getItemById);
router.delete('/:id', protect, deleteItem);

module.exports = router;
