import { Request, Response } from 'express';
import pool from '../config/db'; // Your DB connection

// @desc    Get user's cart
// @route   GET /cart
export const getCart = async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  if (!customerId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    // This is a JOIN query as required by your project
    const [items]: any = await pool.query(
      `SELECT b.Book_ID, b.Title, b.Author, b.Price, b.Stock, ci.Quantity
       FROM Cart_Items ci
       JOIN Books b ON ci.BID = b.Book_ID
       WHERE ci.CID = ?`,
      [customerId]
    );
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add or update item in cart
// @route   POST /cart
export const addToCart = async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  const { bookId, quantity } = req.body;

  if (!bookId || !quantity) {
    return res.status(400).json({ message: 'Missing bookId or quantity' });
  }

  try {
    // This "UPSERT" query is a core part of the cart logic
    await pool.query(
      `INSERT INTO Cart_Items (CID, BID, Quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE Quantity = ?`,
      [customerId, bookId, quantity, quantity]
    );
    res.status(200).json({ message: 'Cart updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /cart/:bookId
export const removeFromCart = async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  const { bookId } = req.params;

  try {
    await pool.query(
      'DELETE FROM Cart_Items WHERE CID = ? AND BID = ?',
      [customerId, bookId]
    );
    res.status(200).json({ message: 'Item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};