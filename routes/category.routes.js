import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
  reorderCategory
} from '../controllers/category.controller.js';

const router = express.Router();

// Get all categories
router.get('/', getAllCategories);

// Get single category
router.get('/:id', getCategoryById);

// Create category
router.post('/', createCategory);

// Update category
router.put('/:id', updateCategory);

// Delete category (soft delete)
router.delete('/:id', deleteCategory);

// Toggle active status
router.patch('/:id/toggle-active', toggleCategoryActive);

// Reorder category
router.patch('/:id/reorder', reorderCategory);

export default router;
