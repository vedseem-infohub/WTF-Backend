import express from 'express';
import { uploadImage } from '../controllers/upload.controllers.js';

const router = express.Router();

// Upload image to Cloudinary
router.post('/', uploadImage);

export default router;
