import { Router } from 'express'
import { pool } from '../config/db';
import { protect } from '../middleware/auth.middleware';
import upload from '../config/upload';

const router = Router()

router.post(
  '/', // Make sure only logged-in users can access
  upload.single('image'), // 'image' must match the form field name
  async (req, res) => {
    // 1. Check if user is an admin (you'll need to add this logic)
    // For now, we'll just check if they are logged in.
    
    // 2. Get file path
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    // Path will be like 'uploads/12345-my-book.jpg'. We want to store the URL path.
    const imagePath = `/${req.file.path.replace(/\\/g, '/')}`; // Fix for Windows paths

    // 3. Get book details from form body
    const { title, author, genre, published, price, stock, language } = req.body;

    // 4. Validate
    if (!title || !author || !price || !stock) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // 5. Insert into DB
    try {
      const [result] = await pool.query(
        `INSERT INTO Books (Title, Author, Genre, Published, Price, Stock, Language, ImagePath)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, author, genre, published, price, stock, language || 'English', imagePath]
      );
      res.status(201).json({ message: 'Book created successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// --- ADD THIS 'PUT' (UPDATE) ROUTE ---
// @route   PUT /books/:id
// @desc    Admin updates a book
router.put('/:id',  async (req, res) => {
  const { id } = req.params;
  // Note: We get lowercase from the form
  const { title, author, genre, published, price, stock, language } = req.body;

  try {
    await pool.query(
      `UPDATE Books 
       SET Title = ?, Author = ?, Genre = ?, Published = ?, Price = ?, Stock = ?, Language = ?
       WHERE Book_ID = ?`,
      [title, author, genre, published, price, stock, language, id]
    );
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating book' });
  }
});

// --- ADD THIS 'DELETE' ROUTE ---
// @route   DELETE /books/:id
// @desc    Admin deletes a book
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Books WHERE Book_ID = ?', [id]);
    res.status(204).send(); // 204 No Content is standard for delete
  } catch (error: any) {
    console.error(error);
    
    // This is crucial: Check if the delete failed due to a foreign key
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ 
        message: 'Cannot delete this book. It is already part of a customer\'s order.' 
      });
    }
    res.status(500).json({ message: 'Server error deleting book' });
  }
});

router.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM Books ORDER BY Title ASC')
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Books WHERE Book_ID = ?', [req.params.id])
  const [book] = rows as any[]
  if (!book) return res.status(404).json({ error: 'Not found' })
  res.json(book)
})

export default router

