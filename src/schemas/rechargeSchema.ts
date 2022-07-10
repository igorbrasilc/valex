import Joi, { Schema } from 'joi';

export const rechargeSchema: Schema = Joi.object({
    cardId: Joi.number().integer().required(),
    amount: Joi.number().positive().min(0.01).required()
})