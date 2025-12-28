const express = require('express');
const router = express.Router();
const Widget = require('../models/Widget');
const { protect } = require('../middleware/auth');

// @route   GET /api/widgets
// @desc    Get all widgets for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const widgets = await Widget.find({ user: req.user.id }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: widgets.length,
      widgets
    });
  } catch (error) {
    console.error('Get widgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching widgets'
    });
  }
});

// @route   POST /api/widgets
// @desc    Create new widget
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const widget = await Widget.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      widget
    });
  } catch (error) {
    console.error('Create widget error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating widget'
    });
  }
});

// @route   PUT /api/widgets/:id
// @desc    Update widget
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let widget = await Widget.findById(req.params.id);

    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found'
      });
    }

    // Check ownership
    if (widget.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this widget'
      });
    }

    widget = await Widget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      widget
    });
  } catch (error) {
    console.error('Update widget error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating widget'
    });
  }
});

// @route   PUT /api/widgets/batch
// @desc    Update multiple widgets positions
// @access  Private
router.put('/batch/update', protect, async (req, res) => {
  try {
    const { widgets } = req.body;

    const updatePromises = widgets.map(widget => 
      Widget.findOneAndUpdate(
        { _id: widget.id, user: req.user.id },
        { position: widget.position, size: widget.size },
        { new: true }
      )
    );

    const updatedWidgets = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      widgets: updatedWidgets
    });
  } catch (error) {
    console.error('Batch update widgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating widgets'
    });
  }
});

// @route   DELETE /api/widgets/:id
// @desc    Delete widget
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const widget = await Widget.findById(req.params.id);

    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found'
      });
    }

    // Check ownership
    if (widget.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this widget'
      });
    }

    await widget.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Widget deleted successfully'
    });
  } catch (error) {
    console.error('Delete widget error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting widget'
    });
  }
});

module.exports = router;
