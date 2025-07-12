const User = require('../models/User');
const Item = require('../models/Item');

exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const itemId = req.params.itemId;

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const exists = user.wishlist.includes(itemId);

    if (exists) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== itemId);
    } else {
      user.wishlist.push(itemId);
    }

    await user.save();
    res.json({ wishlist: user.wishlist, msg: exists ? 'Removed from wishlist' : 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('wishlist');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
