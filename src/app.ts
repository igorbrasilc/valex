import express from 'express';
import cardRouter from './routers/cardRouter.js';

const router = express.Router();
router.use(cardRouter);

export default router;