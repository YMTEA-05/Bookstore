import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

// Make sure you've run this on your DB:
// ALTER TABLE Customer ADD COLUMN Password_Hash VARCHAR(255) NOT NULL;

export const register = async (req: Request, res: Response) => {
  const { name, email, password, address } = req.body;

  // 1. Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }
  if(!address){
    return res.status(400).json({ message: 'Please provide valid address.' });
  }
  try {
    // 2. Check if user already exists
    const [existingUser]: any = await pool.query(
      'SELECT * FROM Customer WHERE Email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Insert the new user
    const [result]: any = await pool.query(
      'INSERT INTO Customer (Name, Email, Password_Hash, Address) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, address || null]
    );

    res.status(201).json({ 
      message: 'User registered successfully', 
      customerId: result.insertId 
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    // 2. Find the user
    const [users]: any = await pool.query(
      'SELECT * FROM Customer WHERE Email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.Password_Hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 4. Create and send JWT
    const payload = {
      user: {
        id: user.Customer_ID,
        name: user.Name,
        email: user.Email,
        Address: user.Address
      },
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined.');
    }

    jwt.sign(
      payload,
      secret,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({
          message: 'Login successful',
          token,
          user: payload.user
        });
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};