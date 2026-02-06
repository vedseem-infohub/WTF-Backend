import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  const { image } = req.body;

  if (!image) {
    console.error("Upload failed: No image data received");
    return res.status(400).json({ message: 'Image data is required' });
  }

  console.log(`[Upload] Received image data length: ${image.length}`);

  try {
    console.log("[Upload] Starting Cloudinary upload...");
    const result = await cloudinary.uploader.upload(image, {
      folder: process.env.CLOUDINARY_FOLDER || 'wtf-admin',
      resource_type: 'auto',
    });
    console.log("[Upload] Cloudinary upload success:", result.public_id);

    const optimizedUrl = cloudinary.url(result.public_id, {
      width: 800,
      height: 800,
      crop: 'limit',
      quality: 'auto',
      fetch_format: 'auto'
    });

    res.status(200).json({
      url: optimizedUrl,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
};
