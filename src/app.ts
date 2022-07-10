import express from 'express';
import cardRouter from './routers/cardRouter.js';
import rechargeRouter from './routers/rechargeRouter.js';
import shoppingRouter from './routers/shoppingRouter.js';

const router = express.Router();
router.use(cardRouter);
router.use(rechargeRouter);
router.use(shoppingRouter);

export default router;