import express from 'express';
import {
  getAllYoutubeLinks,
  addYoutubeLink,
  deleteYoutubeLink
} from '../controllers/youtube.controllers.js';

const router = express.Router();

router.get('/', getAllYoutubeLinks);
router.post('/', addYoutubeLink);
router.delete('/:id', deleteYoutubeLink);

export default router;
