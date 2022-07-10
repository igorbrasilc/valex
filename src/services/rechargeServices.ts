import * as cardUtils from '../utils/cardUtils.js';
import * as repository from "../repositories/rechargeRepository.js";
import { RechargeInsertData } from '../repositories/rechargeRepository.js';

export async function rechargeCard(cardId: number, amount: number) {
    const card = await cardUtils.checkIfCardExistsAndReturnCard(cardId);
    cardUtils.checkIfCardIsActive(card.password, 'toRecharge');
    cardUtils.checkExpirationDate(card.expirationDate);

    const amountFormatted = Number(amount.toFixed(2));
    const rechargeObject: RechargeInsertData = {
        cardId,
        amount: amountFormatted
    }

    await repository.insert(rechargeObject);
}