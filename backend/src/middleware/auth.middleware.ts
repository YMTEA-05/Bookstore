import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type to include our user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Get token from header (e.g., "Bearer 12345abcdef")
      token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user: { id: number } };

      // Attach user to the request object
      req.user = decoded.user;
      
      next(); // Move to the next middleware or controller
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};