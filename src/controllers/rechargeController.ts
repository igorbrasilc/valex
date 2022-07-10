import { Request, Response } from "express";
import * as services from '../services/rechargeServices.js';

export async function rechargeCard(req: Request, res: Response) {
    const {companyInfos} = res.locals;
    const {cardId, amount} : {cardId: number, amount: number} = req.body;

    await services.rechargeCard(cardId, amount);

    res.sendStatus(201);
}