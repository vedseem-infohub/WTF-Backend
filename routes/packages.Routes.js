import express from 'express';
import { getAllPackages, addPackage, deletePackage, updatePackage } from '../controllers/packages.controllers.js';
// import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',
  getAllPackages
);

router.post('/',
  // verifyToken,
  addPackage
);

router.put('/:id',
  // verifyToken,
  updatePackage
);

router.delete('/:id',
  // verifyToken,
  deletePackage
);

export default router;