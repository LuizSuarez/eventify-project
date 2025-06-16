// const User = require('../models/User');
// const bcrypt = require('bcryptjs');

// // Get all users (admin only)
// exports.getAllUsers = async (req, res) => {
//   const users = await User.find().select('-password');
//   res.json(users);
// };

// // Get single user by ID (self or admin)
// exports.getUser = async (req, res) => {
//   const user = await User.findById(req.params.id).select('-password');
//   if (!user) return res.status(404).json({ msg: 'User not found' });
//   res.json(user);
// };

// // Update user (self or admin)
// exports.updateUser = async (req, res) => {
//   const { name, email, password } = req.body;
//   const update = { name, email };
//   if (password) update.password = await bcrypt.hash(password, 10);

//   const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
//   if (!user) return res.status(404).json({ msg: 'User not found' });
//   res.json(user);
// };

// // Delete user (self or admin)
// exports.deleteUser = async (req, res) => {
//   const user = await User.findByIdAndDelete(req.params.id);
//   if (!user) return res.status(404).json({ msg: 'User not found' });
//   res.json({ msg: 'User deleted' });
// };

// // controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Admin only: Create a new user
exports.adminAddUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ msg: 'Please enter all fields: name, email, password, and role.' });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with that email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        res.status(201).json({ msg: 'User created successfully by admin', user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    } catch (err) {
        console.error('Error creating user by admin:', err);
        res.status(500).json({ msg: 'Failed to create user' });
    }
};


// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        // Only return users if the requesting user is an admin
        // This check will also be enforced by the route middleware
        const users = await User.find().select('-password');
        res.json({ success: true, data: users });
    } catch (err) {
        console.error('Error fetching all users:', err);
        res.status(500).json({ msg: 'Failed to fetch users', error: err.message });
    }
};

// Get single user by ID (self or admin)
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        
        // Authorization: A user can get their own profile, or an admin can get any user's profile
        if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, msg: 'Not authorized to view this user profile' });
        }

        res.json({ success: true, data: user });
    } catch (err) {
        console.error('Error fetching single user:', err);
        res.status(500).json({ msg: 'Failed to fetch user', error: err.message });
    }
};

// Update user (self or admin)
exports.updateUser = async (req, res) => {
    const { name, email, password, role } = req.body; // Allow admin to update role

    // Filter out _id if it's accidentally sent in body
    const updateFields = { name, email };
    if (password) updateFields.password = await bcrypt.hash(password, 10);
    // Allow admin to update role
    if (req.user.role === 'admin' && role) {
        updateFields.role = role;
    } else if (req.user.role !== 'admin' && role && role !== req.user.role) {
        // Prevent non-admins from changing their own role
        return res.status(403).json({ success: false, msg: 'Not authorized to change role' });
    }


    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Authorization: A user can update their own profile, or an admin can update any user's profile
        if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, msg: 'Not authorized to update this user' });
        }
        
        // Prevent a user from updating their own email to an already existing one (if not admin changing someone else's)
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({ success: false, msg: 'Email already in use by another account.' });
            }
        }
        
        Object.assign(user, updateFields); // Apply updates
        await user.save(); // Save to trigger pre-save hooks (like password hashing if needed)

        // Return user without password
        const updatedUser = user.toObject();
        delete updatedUser.password;
        
        res.json({ success: true, msg: 'User updated successfully', user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ success: false, msg: 'Failed to update user', error: err.message });
    }
};

// Delete user (self or admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Authorization: A user can delete their own account, or an admin can delete any user
        if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, msg: 'Not authorized to delete this user' });
        }

        // Prevent admin from deleting themselves (optional but recommended)
        if (req.user.role === 'admin' && req.user._id.toString() === user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Admin cannot delete their own account via this endpoint.' });
        }

        await User.deleteOne({ _id: req.params.id }); // Using deleteOne or findByIdAndDelete

        res.json({ success: true, msg: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ success: false, msg: 'Failed to delete user', error: err.message });
    }
}
