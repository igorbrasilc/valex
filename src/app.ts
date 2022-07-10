import express from 'express';
import cardRouter from './routers/cardRouter.js';
import rechargeRouter from './routers/rechargeRouter.js';

const router = express.Router();
router.use(cardRouter);
router.use(rechargeRouter);

export default router;