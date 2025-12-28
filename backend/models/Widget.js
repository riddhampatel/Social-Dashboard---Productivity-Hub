const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['tasks', 'notes', 'bookmarks', 'calendar', 'weather', 'clock', 'quotes']
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  size: {
    w: { type: Number, default: 4 },
    h: { type: Number, default: 4 }
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Widget', widgetSchema);
