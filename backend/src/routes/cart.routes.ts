import { Router } from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cart.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All these routes are protected. A user must be logged in.
router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart);

router.route('/:bookId')
  .delete(protect, removeFromCart);
  
export default router;