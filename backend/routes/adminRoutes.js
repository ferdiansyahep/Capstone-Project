import express from 'express';
import { deleteAdmin, getAllAdmin, getAdminById, loginAdmin, createAdmin, updateAdmin } from '../controllers/adminController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/register', createAdmin);
router.get('/', authenticateToken, getAllAdmin);
router.get('/:id', authenticateToken, getAdminById);
router.put('/:id', authenticateToken, updateAdmin);
router.delete('/:id', authenticateToken, deleteAdmin);

export default router;