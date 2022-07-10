import { Router } from 'express';
import {validateHeader} from '../middlewares/validateHeader.js';
import * as schemas from "../schemas/rechargeSchema.js";
import * as controllers from '../controllers/rechargeController.js';
import validateSchema from '../middlewares/validateSchema.js';

const rechargeRouter = Router();

rechargeRouter.post('/recharge', [validateHeader, validateSchema(schemas.rechargeSchema)], controllers.rechargeCard)

export default rechargeRouter;
