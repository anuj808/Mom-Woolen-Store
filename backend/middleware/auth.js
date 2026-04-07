import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Not authenticated. Please log in.' });
    }
    const token   = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, error: 'Account not found or suspended.' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired session. Please log in again.' });
  }
};

export const authorize = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ success: false, error: 'You do not have permission for this action.' });
    }
    next();
  };