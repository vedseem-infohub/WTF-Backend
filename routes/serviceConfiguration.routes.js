import express from 'express';
import {
  getServiceConfiguration,
  createOrUpdateConfiguration,
  addOptionType,
  removeOptionType,
  reorderOptionTypes
} from '../controllers/serviceConfiguration.controller.js';

const router = express.Router();

// Get configuration for a service
router.get('/:serviceId', getServiceConfiguration);

// Create or update full configuration
router.put('/:serviceId', createOrUpdateConfiguration);

// Add single option type
router.post('/:serviceId/option-type', addOptionType);

// Remove option type
router.delete('/:serviceId/option-type/:key', removeOptionType);

// Reorder option types
router.patch('/:serviceId/reorder-options', reorderOptionTypes);

export default router;
