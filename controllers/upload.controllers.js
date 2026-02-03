import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: 'Image data is required' });
  }

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: process.env.CLOUDINARY_FOLDER || 'wtf-admin',
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
      eager: [
        { width: 400, height: 400, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
        { width: 800, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
      ],
      eager_async: true
    });

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
