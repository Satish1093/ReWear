const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL'],
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ['Tops', 'Bottoms', 'Footwear', 'Accessories'],
    required: true,
  },
  condition: {
    type: String,
    enum: ['New', 'Good', 'Worn'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    enum: ['swap', 'points'],
    default: 'swap',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
 status: {
  type: String,
  enum: ['Available', 'Swapped', 'Pending'],
  default: 'Pending',

  },
  featured: {
    type: Boolean,
    default: true  
  },
  isSold: {
  type: Boolean,
  default: false,
},
soldTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
}

}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
