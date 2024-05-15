import express from 'express';
import { createKelas, getAllKelas, getKelasById, updateKelas, deleteKelas } from '../controllers/kelasController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createKelas);
router.get('/', authenticateToken, getAllKelas);
router.get('/:id', authenticateToken, getKelasById);
router.put('/:id', authenticateToken, updateKelas);
router.delete('/:id', authenticateToken, deleteKelas);

export default router;
