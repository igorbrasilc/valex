import { Request, Response } from "express";
import * as services from '../services/shoppingServices.js';

export async function buyInAPostOfSale(req: Request, res: Response) {
    const { cardId, password, businessId, amount } : 
    {cardId: number, password: string, businessId: number, amount: number} = req.body;

    await services.postBuy(cardId, password, businessId, amount);

    res.sendStatus(200);
}