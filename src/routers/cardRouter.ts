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

export default cardRouter;

