const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

function getPasswordValidationErrors(password) {
  const errors = [];
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must include at least one lowercase letter.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must include at least one uppercase letter.");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must include at least one digit.");
  }
  if (!/[\W_]/.test(password)) {
    errors.push("Password must include at least one special character.");
  }
  return errors;
}

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Role validation
    const validRoles = ['user', 'provider', 'venue', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: ['Invalid role specified.'] });
    }

    // ✅ Password validation
    const passwordErrors = getPasswordValidationErrors(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ msg: passwordErrors });
    }

    // ✅ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: ['Email already exists.'] });
    }

    // ✅ Hash password & create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ msg: ['Signup successful.'] });
  } catch (err) {
    res.status(500).json({ msg: [err.message] });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

  res.json({
  token,
  user: { _id: user._id, name: user.name, email: user.email, role: user.role }
});

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: 'User not found' });

  const token = crypto.randomBytes(20).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 10; 
  await user.save();

  const resetURL = `http://localhost:3000/reset-password/${token}`;
  const html = `<p>You requested password reset</p><p>Click <a href="${resetURL}">here</a> to reset</p>`;

  await sendEmail(user.email, 'Password Reset', html);
  res.json({ msg: 'Reset link sent to email' });
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;  // <-- Use newPassword here, not password
    const { token } = req.params;

    if (!newPassword) {
      return res.status(400).json({ msg: ["New password is required."] });
    }

    const passwordErrors = getPasswordValidationErrors(newPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ msg: passwordErrors });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: ["Invalid or expired token."] });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({ msg: ["Password has been reset successfully."] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: [err.message || "Something went wrong."] });
  }
};