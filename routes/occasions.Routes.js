import express from 'express';
import {
  getAllOccasions,
  addOccasion,
  updateOccasion,
  deleteOccasion
} from '../controllers/occasions.controllers.js';

const router = express.Router();


router.get('/', getAllOccasions);


router.post('/', addOccasion);


router.put('/:id', updateOccasion);

router.delete('/:id', deleteOccasion);

export default router;
