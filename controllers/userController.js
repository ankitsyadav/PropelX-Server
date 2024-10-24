const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User = require("../models/UserModel");
const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Replace with your remove.bg API key

// Configure Multer to use Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_images",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage }).single("profileImage");

// Ensure directory exists
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Update user profile image
/**
 * @swagger
 * /users/{id}/profile-image:
 *   put:
 *     summary: Update user profile image
 *     description: Updates the profile image of a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: The request body should contain the profile image
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 description: The profile image URL
 *                 example: "https://example.com/profile-image.jpg"
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Profile image updated successfully"
 *                 profileImageUrl:
 *                   type: string
 *                   description: The URL of the updated profile image
 *                   example: "https://cloudinary.com/updated-profile-image.jpg"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Invalid request"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */
const updateProfileImage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const userId = req.params.id;
      const cloudinaryImageUrl = req.file.path;

      // Remove the background
      const response = await axios({
        method: "post",
        url: "https://api.remove.bg/v1.0/removebg",
        headers: {
          "X-Api-Key": process.env.REMOVE_BG_API_KEY,
        },
        data: {
          image_url: cloudinaryImageUrl,
          size: "auto",
        },
        responseType: "arraybuffer",
      });

      if (response.status !== 200) {
        throw new Error(`Failed to remove background: ${response.statusText}`);
      }

      const buffer = Buffer.from(response.data, "binary");
      const uploadDir = path.join(__dirname, "../uploads/profile_images");
      const outputFilePath = path.join(
        uploadDir,
        `${path.basename(
          req.file.filename,
          path.extname(req.file.filename)
        )}-sticker.png`
      );

      // Debug logs
      console.log(`Cloudinary Image URL: ${cloudinaryImageUrl}`);
      console.log(`Upload Directory: ${uploadDir}`);
      console.log(`Output File Path: ${outputFilePath}`);

      // Ensure the upload directory exists
      ensureDirectoryExistence(uploadDir);

      // Process the image with sharp
      await sharp(buffer).resize(512, 512).toFile(outputFilePath);

      // Upload the processed image to Cloudinary
      const result = await cloudinary.uploader.upload(outputFilePath, {
        folder: "profile_images",
        public_id: `${userId}_profile_sticker`,
      });

      // Remove the local processed file
      fs.unlinkSync(outputFilePath);

      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update the profile image URL
      user.profileImageUrl = result.secure_url;
      await user.save();

      res.status(200).json({
        message: "Profile image updated successfully",
        profileImageUrl: user.profileImageUrl,
      });
    } catch (error) {
      console.error("Error processing image:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = {
  updateProfileImage,
};
