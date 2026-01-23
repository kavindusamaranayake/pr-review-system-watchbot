const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

/**
 * @route   GET /api/reviews/all
 * @desc    Get all reviews ordered by creation date
 * @access  Public (add authentication later if needed)
 */
router.get('/all', reviewController.getAllReviews);

/**
 * @route   GET /api/reviews
 * @desc    Get all pending reviews
 * @access  Public (add authentication later if needed)
 */
router.get('/', reviewController.getPendingReviews);

/**
 * @route   POST /api/reviews/:id/approve
 * @desc    Approve a review and post to GitHub
 * @access  Public (add authentication later if needed)
 */
router.post('/:id/approve', reviewController.approveReview);

/**
 * @route   POST /api/reviews/:id/reject
 * @desc    Reject a review
 * @access  Public (add authentication later if needed)
 */
router.post('/:id/reject', reviewController.rejectReview);

module.exports = router;
