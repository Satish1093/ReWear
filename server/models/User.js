const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  points: {
    type: Number,
    default: 100,
  },

  // ⭐ ADD THIS
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    }
  ],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
