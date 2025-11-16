// server/controllers/itemController.js
const Item = require('../models/Item');
const User = require('../models/User');

// -------------------------------------------------------------
// ADD NEW ITEM
// -------------------------------------------------------------
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
      owner: req.user,          // Only userId
      status: 'Pending',
      isSold: false
    });

    await newItem.save();
    res.status(201).json(newItem);

  } catch (err) {
    console.error('❌ Error in addItem:', err);
    res.status(500).json({ msg: 'Server error while adding item' });
  }
};

// -------------------------------------------------------------
// GET ALL ITEMS
// -------------------------------------------------------------
const getItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'Available', isSold: false })
      .populate('owner', 'name');

    res.json(items);

  } catch (err) {
    console.error('❌ Error in getItems:', err);
    res.status(500).json({ msg: 'Server error while fetching items' });
  }
};

// -------------------------------------------------------------
// FEATURED ITEMS
// -------------------------------------------------------------
const getFeaturedItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'Available', isSold: false })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(items);

  } catch (err) {
    console.error('❌ Error in getFeaturedItems:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// -------------------------------------------------------------
// GET MY LISTED ITEMS
// -------------------------------------------------------------
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user })
      .populate('owner', 'name email');

    res.json(items);

  } catch (err) {
    console.error('❌ Error fetching my items:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// -------------------------------------------------------------
// GET ITEM BY ID
// -------------------------------------------------------------
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name email');

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    res.json(item);

  } catch (err) {
    console.error('❌ Error in getItemById:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// -------------------------------------------------------------
// DELETE ITEM
// -------------------------------------------------------------
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    if (item.owner.toString() !== req.user) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await item.deleteOne();
    res.json({ msg: 'Item deleted successfully' });

  } catch (err) {
    console.error('❌ Error in deleteItem:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// -------------------------------------------------------------
// BUY ITEM
// -------------------------------------------------------------
const buyItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });
    if (item.isSold) return res.status(400).json({ msg: 'Already sold' });

    item.isSold = true;
    item.soldTo = req.user;

    await item.save();

    res.json({ msg: 'Item purchased successfully!' });

  } catch (err) {
    console.error("❌ Buy error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// -------------------------------------------------------------
// EXPORTS
// -------------------------------------------------------------
module.exports = {
  addItem,
  getItems,
  getItemById,
  deleteItem,
  getMyItems,
  getFeaturedItems,
  buyItem
};
