import express from 'express';
import {
  getServiceSelection,
  saveServiceSelection,
  updateSingleOption,
  getSelectionHistory,
  lockSelection,
  unlockSelection,
  migrateToNewVersion
} from '../controllers/serviceSelection.controller.js';

const router = express.Router();

// Get current selection for a service
router.get('/:serviceId', getServiceSelection);

// Save full selection
router.put('/:serviceId', saveServiceSelection);

// Update single option
router.post('/:serviceId/option/:optionKey', updateSingleOption);

// Get selection history
router.get('/:serviceId/history', getSelectionHistory);

// Lock selection
router.patch('/:serviceId/lock', lockSelection);

// Unlock selection
router.patch('/:serviceId/unlock', unlockSelection);

// Migrate to new configuration version
router.post('/:serviceId/migrate-version', migrateToNewVersion);

export default router;
