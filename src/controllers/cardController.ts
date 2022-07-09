import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as services from '../services/cardServices.js';

export async function createCard(req: Request, res: Response) {
    const { employeeId, type } : {employeeId: number, type: TransactionTypes} = req.body;
    const { companyInfos } = res.locals;

    const card = await services.createCard(employeeId, companyInfos, type);

    res.status(201).send(card);
}

export async function createCardPassword(req: Request, res: Response) {
    const {password, cardId, securityCodeCVC} 
    : {password: string, cardId: number, securityCodeCVC: string} = req.body;

    await services.updateCardPassword(password, cardId, securityCodeCVC);

    res.sendStatus(200);
}

export async function blockCard(req: Request, res: Response) {
    const {password, cardId} 
    : {password: string, cardId: number} = req.body;

    await services.blockCard(password, cardId);

    res.sendStatus(200);
}