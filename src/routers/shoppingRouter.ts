import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema.js';
import * as schemas from "../schemas/shoppingSchema.js";
import * as controllers from '../controllers/shoppingController.js';

const shoppingRouter = Router();

shoppingRouter.post('/buy', validateSchema(schemas.shoppingSchema), controllers.buyInAPostOfSale);

export default shoppingRouter;