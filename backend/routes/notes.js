const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

// @route   GET /api/notes
// @desc    Get all notes for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { search, isPinned, isArchived } = req.query;
    
    const query = { user: req.user.id };
    
    if (isPinned !== undefined) query.isPinned = isPinned === 'true';
    if (isArchived !== undefined) query.isArchived = isArchived === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes'
    });
  }
});

// @route   GET /api/notes/:id
// @desc    Get single note
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this note'
      });
    }

    res.status(200).json({
      success: true,
      note
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching note'
    });
  }
});

// @route   POST /api/notes
// @desc    Create new note
// @access  Private
router.post('/', [
  protect,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const note = await Note.create({
      ...req.body,
      user: req.user.id
    });

    // Emit socket event
    const io = req.app.get('io');
    io.to(req.user.id).emit('note:created', note);

    res.status(201).json({
      success: true,
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating note'
    });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this note'
      });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Emit socket event
    const io = req.app.get('io');
    io.to(req.user.id).emit('note:updated', note);

    res.status(200).json({
      success: true,
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating note'
    });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check ownership
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note'
      });
    }

    await note.deleteOne();

    // Emit socket event
    const io = req.app.get('io');
    io.to(req.user.id).emit('note:deleted', req.params.id);

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting note'
    });
  }
});

module.exports = router;
