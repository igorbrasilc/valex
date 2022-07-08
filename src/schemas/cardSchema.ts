import Joi, { Schema } from 'joi';

export const typeSchema: Schema = Joi.object({
    type: Joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required(),
    employeeId: Joi.number().integer().required(),
})