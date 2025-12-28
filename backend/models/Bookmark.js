const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Bookmark title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  favicon: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    trim: true,
    default: 'Uncategorized'
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookmarkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
