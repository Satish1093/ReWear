const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { toggleWishlist, getWishlist } = require('../controllers/wishlistController');

// Toggle like/unlike
router.post('/toggle/:itemId', protect, toggleWishlist);

// Get user's wishlist items
router.get('/', protect, getWishlist);

module.exports = router;
