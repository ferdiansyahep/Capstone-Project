import express from 'express';
import { deleteGuru, getAllGuru, getGuruById, loginGuru, createGuru, updateGuru } from '../controllers/guruController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginGuru);
router.post('/register', createGuru);
router.get('/', authenticateToken, getAllGuru);
router.get('/:id', authenticateToken, getGuruById);
router.put('/:id', authenticateToken, updateGuru);
router.delete('/:id', authenticateToken, deleteGuru);

export default router;