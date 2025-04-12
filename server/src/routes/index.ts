import express from 'express';
import visionRoutes from './vision';
import geminiRoutes from './gemini';
import databaseRoutes from './database';

const router = express.Router();

router.use('/vision', visionRoutes);
router.use('/gemini', geminiRoutes);
router.use('/database', databaseRoutes);

export default router;
