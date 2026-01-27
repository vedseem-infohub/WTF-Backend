import express from 'express';
import { getAllPackages, addPackage, deletePackage } from '../controllers/packages.controllers.js';

const router = express.Router();

// Get all packages
router.get('/', getAllPackages);

// Add new package
router.post('/', addPackage);

// Delete package
router.delete('/:id', deletePackage);

export default router;
