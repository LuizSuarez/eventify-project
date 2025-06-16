


// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin Routes (for managing all users)
// Protect: Ensures user is logged in
// Authorize('admin'): Ensures logged-in user has 'admin' role

// POST /api/users/admin/add - Admin adds a new user
router.post('/admin/add', protect, authorize('admin'), userController.adminAddUser);

// GET /api/users/admin - Admin gets all users
router.get('/admin', protect, authorize('admin'), userController.getAllUsers);

// GET /api/users/:id - Get single user (can be self or admin viewing others)
// The controller itself has logic to differentiate
router.get('/:id', protect, userController.getUser);

// PUT /api/users/:id - Update user (can be self or admin updating others)
// The controller itself has logic to differentiate and handle role updates for admin
router.put('/:id', protect, userController.updateUser);

// DELETE /api/users/:id - Delete user (can be self-delete or admin deleting others)
// The controller itself has logic to differentiate and prevent admin self-delete
router.delete('/:id', protect, userController.deleteUser);


// Old routes (if any, ensure they are still covered or integrated into above)
// If you had a '/me' route for user profile, keep it:
// router.get('/me', protect, userController.getMe); // Assuming getMe is a controller function

module.exports = router;
