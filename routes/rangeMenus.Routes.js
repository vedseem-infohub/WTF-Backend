import express from 'express';
import {
  getAllRangeMenus,
  addRangeMenu,
  updateRangeMenu,
  deleteRangeMenu
} from '../controllers/rangeMenus.controllers.js';

const router = express.Router();

router.get('/', getAllRangeMenus);
router.post('/', addRangeMenu);
router.put('/:id', updateRangeMenu);
router.delete('/:id', deleteRangeMenu);

export default router;
