import Joi, { Schema } from 'joi';

export const typeSchema: Schema = Joi.object({
    type: Joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required(),
    employeeId: Joi.number().integer().required(),
})

export const activateCardSchema: Schema = Joi.object({
    password: Joi.string().length(4).pattern(/^[0-9]{4}$/).required(),
    cardId: Joi.number().integer().required(),
    securityCodeCVC: Joi.string().length(3).pattern(/^[0-9]{3}$/).required()
})

export const blockOrUnblockCardSchema: Schema = Joi.object({
    password: Joi.string().length(4).pattern(/^[0-9]{4}$/).required(),
    cardId: Joi.number().integer().required()
})

export const cardBalanceSchema: Schema = Joi.object({
    cardId: Joi.number().integer().required()
})

