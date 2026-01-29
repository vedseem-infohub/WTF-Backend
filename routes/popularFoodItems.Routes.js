import express from 'express';
import { getAllFoodItems, addFoodItem, deleteFoodItem, updateFoodItem } from '../controllers/popularFoodItems.controllers.js';

const router = express.Router();

// Get all popular food items
router.get('/', getAllFoodItems);

// Add new popular food item
router.post('/', addFoodItem);

// Delete popular food item
router.delete('/:id', deleteFoodItem);

// Update popular food item
router.put('/:id', updateFoodItem);

export default router;
