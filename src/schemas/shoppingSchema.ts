import Joi, { Schema } from 'joi';

export const shoppingSchema: Schema = Joi.object({
    cardId: Joi.number().integer().required(),
    password: Joi.string().length(4).pattern(/^[0-9]{4}$/).required(),
    businessId: Joi.number().integer().required(),
    amount: Joi.number().positive().min(0.01).required()
})