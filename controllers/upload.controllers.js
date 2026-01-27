import cloudinary from '../config/cloudinary.js';

// Upload image to Cloudinary
export const uploadImage = async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: 'Image data is required' });
  }

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: process.env.CLOUDINARY_FOLDER || 'wtf-admin',
      resource_type: 'auto',
    });

    res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
};
