import express from 'express';
import { deleteSiswa, getAllSiswa, getSiswaById, loginSiswa, createSiswa, updateSiswa } from '../controllers/siswaController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginSiswa);
router.post('/register', createSiswa);
router.get('/', authenticateToken, getAllSiswa);
router.get('/:id', authenticateToken, getSiswaById);
router.put('/:id', authenticateToken, updateSiswa);
router.delete('/:id', authenticateToken, deleteSiswa);

export default router;