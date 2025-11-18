import { Router } from 'express';
import { protect } from '../middleware/auth.middleware'; // We need this!
import pool from '../config/db';

const router = Router();

// @route   GET /orders
// @desc    Get all orders for the logged-in user
router.get('/', protect, async (req, res) => {
  const customerId = req.user?.id;

  try {
    // This query JOINS Orders, Order_Items, and Books.
    // It uses JSON_ARRAYAGG (an aggregate function) to group all
    // items into a nested JSON array for each order.
    const [orders] = await pool.query(
      `
      SELECT
        o.Order_ID,
        o.Order_Date,
        o.Total_Amount,
        o.Status,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'Book_ID', b.Book_ID,
            'Title', b.Title,
            'ImagePath', b.ImagePath,
            'Quantity', oi.Quantity,
            'Price', oi.Price
          )
        ) AS items
      FROM Orders o
      JOIN Order_Items oi ON o.Order_ID = oi.OID
      JOIN Books b ON oi.BID = b.Book_ID
      WHERE o.CID = ?
      GROUP BY o.Order_ID
      ORDER BY o.Order_Date DESC
    `,
      [customerId]
    );

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /orders/checkout
// @desc    Create a new order from the user's cart
router.post('/checkout', protect, async (req, res) => {
  const customerId = req.user?.id;
  if (!customerId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    // Call the stored procedure
    await pool.query('CALL sp_CreateOrderFromCart(?)', [customerId]);
    
    res.status(201).json({ message: 'Order placed successfully!' });

  } catch (error: any) {
    // Check for our custom stock error
    if (error.sqlState === '45000') {
      return res.status(400).json({ message: error.sqlMessage });
    }
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Server error during checkout.' });
  }
});


export default router;
