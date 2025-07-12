const User = require('../models/User');

const adminOnly = async (req, res, next) => {
  try {
    // `req.user` is set by your `protect` middleware
    const user = await User.findById(req.user);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }

    next();
  } catch (err) {
    console.error('Admin check error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = adminOnly;
