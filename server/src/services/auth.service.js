const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const ApiError = require('../utils/ApiError');

class AuthService {
  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
  }

  static async register({ name, email, password, business_name }) {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, 'Email sudah terdaftar');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      business_name,
    });

    // Generate token
    const token = AuthService.generateToken(user.id);

    return { user, token };
  }

  static async login({ email, password }) {
    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Email atau password salah');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Email atau password salah');
    }

    // Generate token
    const token = AuthService.generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  static async getMe(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User tidak ditemukan');
    }
    return user;
  }
}

module.exports = AuthService;
