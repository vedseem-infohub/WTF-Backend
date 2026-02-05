import express from 'express';
import {
  getAllServices,
  getServiceById,
  getServicesByCategory,
  searchServices,
  createService,
  updateService,
  deleteService,
  toggleServiceActive,
  toggleServiceFeatured
} from '../controllers/service.controller.js';

const router = express.Router();

// Search services
router.get('/search', searchServices);

// Get services by category
router.get('/category/:categoryId', getServicesByCategory);

// Get all services
router.get('/', getAllServices);

// Get single service
router.get('/:id', getServiceById);

// Create service
router.post('/', createService);

// Update service
router.put('/:id', updateService);

// Delete service (soft delete)
router.delete('/:id', deleteService);

// Toggle active status
router.patch('/:id/toggle-active', toggleServiceActive);

// Toggle featured status
router.patch('/:id/toggle-featured', toggleServiceFeatured);

export default router;
