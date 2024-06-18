const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/UserModel');

// Configure Multer to use Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const upload = multer({ storage }).single('profileImage');

// Update user profile image
const updateProfileImage = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const userId = req.params.id;
            const profileImageUrl = req.file ? req.file.path : null;

            // Check if the user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update the profile image URL
            user.profileImageUrl = profileImageUrl;
            await user.save();

            res.status(200).json({
                message: 'Profile image updated successfully',
                profileImageUrl: user.profileImageUrl, // Return the updated URL
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

module.exports = {
    updateProfileImage
};
