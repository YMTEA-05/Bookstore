import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import pool from '../config/db';

const router = Router();

// @route   GET /reviews/:bookId
// @desc    Get all reviews for a specific book
router.get('/:bookId', async (req, res) => {
  const { bookId } = req.params;
  try {
    // This is a JOIN query as required
    const [reviews] = await pool.query(
      `
      SELECT r.Rating, r.Comments, r.Created_at, c.Name AS CustomerName
      FROM Reviews r
      JOIN Customer c ON r.CID = c.Customer_ID
      WHERE r.BID = ?
      ORDER BY r.Created_at DESC
    `,
      [bookId]
    );
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /reviews/:bookId
// @desc    Create a new review for a book
router.post('/:bookId', protect, async (req, res) => {
  const { bookId } = req.params;
  const { rating, comments } = req.body;
  const customerId = req.user?.id;

  if (!rating || !comments) {
    return res.status(400).json({ message: 'Rating and comments are required.' });
  }

  try {
    await pool.query(
      'INSERT INTO Reviews (BID, CID, Rating, Comments) VALUES (?, ?, ?, ?)',
      [bookId, customerId, rating, comments]
    );
    // The trigger (sp_UpdateBookRating) will automatically update the book's average
    res.status(201).json({ message: 'Review added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;