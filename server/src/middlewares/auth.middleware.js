const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Akses ditolak. Token tidak ditemukan.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Token tidak valid'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token sudah kadaluarsa'));
    } else {
      next(new ApiError(500, 'Terjadi kesalahan autentikasi'));
    }
  }
};

module.exports = auth;
