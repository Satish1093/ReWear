// server/controllers/adminController.js
const Item = require('../models/Item');

// @desc    Get all pending items
const getPendingItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'Pending' }).populate('owner', 'name email');
    res.json(items);
  } catch (err) {
    console.error('Error fetching pending items:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Approve item by setting status to Available
const approveItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    item.status = 'Available';
    await item.save();

    res.json({ msg: 'Item approved successfully', item });
  } catch (err) {
    console.error('Error approving item:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  getPendingItems,
  approveItem,
};
