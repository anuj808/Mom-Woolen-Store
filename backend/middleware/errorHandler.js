const errorHandler = (err, req, res, next) => {
  console.error(`[${req.method}] ${req.path} →`, err.message);

  if (err.name === 'CastError')
    return res.status(400).json({ success: false, error: 'Invalid ID.' });

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, error: `${field} already in use.` });
  }

  if (err.name === 'ValidationError') {
    const msgs = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, error: msgs.join(', ') });
  }

  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ success: false, error: 'Invalid token.' });

  if (err.name === 'TokenExpiredError')
    return res.status(401).json({ success: false, error: 'Session expired. Please log in again.' });

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Something went wrong.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;