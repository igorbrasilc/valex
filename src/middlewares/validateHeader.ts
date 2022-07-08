import { Request, Response, NextFunction } from "express";
import * as companyRepository from "../repositories/companyRepository.js";

export async function validateHeader(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.header('x-api-key');
    const apiKeyValidation = apiKey ? await companyRepository.findByApiKey(apiKey) : null;

    if (!apiKey || !apiKeyValidation) {
        throw {
            type: 'unauthorized',
            message: 'you need to send a valid api key to create a card'
        }
    }

    res.locals.companyInfos = apiKeyValidation;

    next();
}