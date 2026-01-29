import express from 'express';
import {
  getAllMenuItems,
  addMenuItem,
  addBulkMenuItems,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuItems.controllers.js';

const router = express.Router();

router.get('/', getAllMenuItems);
router.post('/', addMenuItem);
router.post('/bulk', addBulkMenuItems);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
