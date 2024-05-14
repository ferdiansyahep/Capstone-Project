import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import db from './config/db.js';
import { notFound } from './middlewares/errorMiddleware.js';

import adminRoutes from './routes/adminRoutes.js';
import guruRoutes from './routes/guruRoutes.js';
import siswaRoutes from './routes/siswaRoute.js';

dotenv.config();
const app = express();

(async() => {
    await db.sync();
})();

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/admin', adminRoutes);
app.use('/api/guru', guruRoutes);
app.use('/api/siswa', siswaRoutes);

app.use(notFound)
app.listen(process.env.APP_PORT, () => {
    console.log(`Server running on port ${process.env.APP_PORT}`)
});
