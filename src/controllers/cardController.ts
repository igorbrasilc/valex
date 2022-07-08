import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as services from '../services/cardServices.js';

export async function createCard(req: Request, res: Response) {
    const { employeeId, type } : {employeeId: number, type: TransactionTypes} = req.body;
    const { companyInfos } = res.locals;

    const card = await services.createCard(employeeId, companyInfos, type);

    res.status(201).send(card);
}