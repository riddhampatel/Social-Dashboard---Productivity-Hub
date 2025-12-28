const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/auth');

// @route   GET /api/bookmarks
// @desc    Get all bookmarks for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { search, tag, category, isFavorite } = req.query;
    
    const query = { user: req.user.id };
    
    if (tag) query.tags = tag;
    if (category) query.category = category;
    if (isFavorite !== undefined) query.isFavorite = isFavorite === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } }
      ];
    }

    const bookmarks = await Bookmark.find(query).sort({ isFavorite: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      bookmarks
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookmarks'
    });
  }
});

// @route   GET /api/bookmarks/:id
// @desc    Get single bookmark
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    // Check ownership
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this bookmark'
      });
    }

    res.status(200).json({
      success: true,
      bookmark
    });
  } catch (error) {
    console.error('Get bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookmark'
    });
  }
});

// @route   POST /api/bookmarks
// @desc    Create new bookmark
// @access  Private
router.post('/', [
  protect,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('url').trim().isURL().withMessage('Valid URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Extract favicon from URL
    const url = new URL(req.body.url);
    const favicon = `${url.protocol}//${url.hostname}/favicon.ico`;

    const bookmark = await Bookmark.create({
      ...req.body,
      favicon,
      user: req.user.id
    });

    // Emit socket event
    const io = req.app.get('io');
    io.to(req.user.id).emit('bookmark:created', bookmark);

    res.status(201).json({
      success: true,
      bookmark
    });
  } catch (error) {
    console.error('Create bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating bookmark'
    });
  }
});

// @route   PUT /api/bookmarks/:id
// @desc    Update bookmark
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    // Check ownership
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this bookmark'
      });
    }

    bookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Emit socket event
    const io = req.app.get('io');
    io.to(req.user.id).emit('bookmark:updated', bookmark);

    res.status(200).json({
      success: true,
      bookmark
    });
  } catch (error) {
    console.error('Update bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bookmark'
    });
  }
});

// @route   DELETE /api/bookmarks/:id
// @desc    Delete bookmark
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found'
      });
    }

    // Check ownership
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this bookmark'
      });
    }

    await bookmark.deleteOne();

    // Emit socket event
    const io = req.app.get('io');
    io.to(req.user.id).emit('bookmark:deleted', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Bookmark deleted successfully'
    });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting bookmark'
    });
  }
});

module.exports = router;
