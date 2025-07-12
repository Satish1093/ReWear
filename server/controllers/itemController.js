// server/controllers/itemController.js
const Item = require('../models/Item');

// @desc    Add new item
const addItem = async (req, res) => {
  try {
    const {
      title,
      size,
      points,
      category,
      condition,
      description,
      mode
    } = req.body;

    const image = req.file;

    if (!image) {
      return res.status(400).json({ msg: 'Image upload is required' });
    }

    const newItem = new Item({
      title,
      size,
      points: mode === 'points' ? points : 0,
      category,
      condition,
      description,
      mode,
      imageUrl: `/uploads/${image.filename}`,
      owner: req.user,
      status: 'Pending',
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('❌ Error in addItem:', err);
    res.status(500).json({ msg: 'Server error while adding item' });
  }
};

// @desc    Get all available items
const getItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'Available' }).populate('owner', 'name');
    res.json(items);
  } catch (err) {
    console.error('❌ Error in getItems:', err);
    res.status(500).json({ msg: 'Server error while fetching items' });
  }
};

const getFeaturedItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'Available' }).sort({ createdAt: -1 }).limit(6);
    res.json(items);
  } catch (err) {
    console.error('❌ Error in getFeaturedItems:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user }).populate('owner', 'name');
    res.json(items);
  } catch (err) {
    console.error('Error fetching my items:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
// @desc    Get item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name email');
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('❌ Error in getItemById:', err);
    res.status(500).json({ msg: 'Server error while fetching item' });
  }
};

// @desc    Delete item (only by owner)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });

    if (item.owner.toString() !== req.user) {
      return res.status(403).json({ msg: 'Not authorized to delete this item' });
    }

    await item.remove();
    res.json({ msg: 'Item deleted successfully' });
  } catch (err) {
    console.error('❌ Error in deleteItem:', err);
    res.status(500).json({ msg: 'Server error while deleting item' });
  }
};

// ✅ Export all controllers
module.exports = {
  addItem,
  getItems,
  getItemById,
  deleteItem,
  getMyItems,
  getFeaturedItems,
};
