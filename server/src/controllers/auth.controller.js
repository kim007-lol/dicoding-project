const AuthService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const { name, email, password, business_name } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json(new ApiResponse(400, null, 'Name, email, dan password wajib diisi'));
  }

  const result = await AuthService.register({ name, email, password, business_name });
  res.status(201).json(new ApiResponse(201, result, 'Registrasi berhasil'));
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json(new ApiResponse(400, null, 'Email dan password wajib diisi'));
  }

  const result = await AuthService.login({ email, password });
  res.status(200).json(new ApiResponse(200, result, 'Login berhasil'));
});

const getMe = catchAsync(async (req, res) => {
  const user = await AuthService.getMe(req.user.id);
  res.status(200).json(new ApiResponse(200, user, 'Data user berhasil diambil'));
});

module.exports = { register, login, getMe };
