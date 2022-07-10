import { Router } from "express";
import validateSchema from '../middlewares/validateSchema.js';
import * as schemas from "../schemas/cardSchema.js";
import * as middleware from '../middlewares/validateHeader.js';
import * as controllers from '../controllers/cardController.js';

const cardRouter = Router();

cardRouter.post('/new-card', 
    [middleware.validateHeader, validateSchema(schemas.typeSchema)], 
    controllers.createCard);

cardRouter.put('/activate-card', 
    validateSchema(schemas.activateCardSchema), 
    controllers.createCardPassword);

    //ainda não fiz a visualização de saldo e transações

cardRouter.put('/block-card', validateSchema(schemas.blockOrUnblockCardSchema), controllers.blockCard);
cardRouter.put('/unblock-card', validateSchema(schemas.blockOrUnblockCardSchema), controllers.unblockCard);

export default cardRouter;

