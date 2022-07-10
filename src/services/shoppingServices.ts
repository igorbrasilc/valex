import { PaymentInsertData } from '../repositories/paymentRepository.js';
import * as cardUtils from '../utils/cardUtils.js';
import * as shoppingUtils from '../utils/shoppingUtils.js';
import * as paymentRepository from '../repositories/paymentRepository.js';

export async function postBuy(cardId: number, password: string, businessId: number, amount: number) {
    const card = await cardUtils.checkIfCardExistsAndReturnCard(cardId);
    cardUtils.checkIfCardIsActive(card.password, 'toBuy');
    cardUtils.unhashAndComparePasswords(password, card.password);
    cardUtils.checkExpirationDate(card.expirationDate);
    cardUtils.checkIfCardIsBlocked(card.isBlocked);

    const business = await shoppingUtils.checkIfBusinessExistsAndReturnBusiness(businessId);
    shoppingUtils.compareCardTypeWithBusinessType(card.type, business.type);

    const balance = await shoppingUtils.getBalanceOfCardFromTransactions(cardId);
    shoppingUtils.compareBalanceWithPurchase(balance, amount);

    const purchaseDataObj: PaymentInsertData = {
        cardId,
        businessId,
        amount
    };

    await paymentRepository.insert(purchaseDataObj);
}