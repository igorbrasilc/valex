import * as businessRepository from '../repositories/businessRepository.js';
import * as paymentRepository from '../repositories/paymentRepository.js';
import * as rechargeRepository from '../repositories/rechargeRepository.js';
import { TransactionTypes } from '../repositories/cardRepository.js';

export async function checkIfBusinessExistsAndReturnBusiness(businessId: number) {
    const business = await businessRepository.findById(businessId);

    if (!business) {
        throw {
            type: 'notFound',
            message: 'Business not found as a point of sale'
        }
    }

    return business;
}

export function compareCardTypeWithBusinessType(cardType: TransactionTypes, businessType: TransactionTypes) {
    if (cardType !== businessType) {
        throw {
            type: 'unauthorized',
            message: 'The type of the card is different from business'
        }
    }
}

export async function getBalanceOfCardFromTransactions(cardId: number) {
    const payments = await getPaymentsFromCard(cardId, 'getBalance');
    const recharges = await getRechargesFromCard(cardId, 'getBalance');
    
    return (Number(recharges) - Number(payments));
}

export async function getPaymentsFromCard(cardId: number, intention: 'getBalance' | 'getTransactions') {
    const payments = await paymentRepository.findByCardId(cardId);

    if (intention === 'getBalance') {
        return payments.reduce((sum, payment) => sum + payment.amount, 0);
    }

    if (intention === 'getTransactions') {
        return payments;
    }
}

export async function getRechargesFromCard(cardId: number, intention: 'getBalance' | 'getTransactions') {
    const recharges = await rechargeRepository.findByCardId(cardId);

    if (intention === 'getBalance') {
        return recharges.reduce((sum, recharge) => sum + recharge.amount, 0);
    }

    if (intention === 'getTransactions') {
        return recharges;
    }
}

export function compareBalanceWithPurchase(cardBalance: number, purchaseAmount: number) {
    const comparison = cardBalance - purchaseAmount;
    if (comparison < 0) {
        throw {
            type: 'notAllowed',
            message: 'Insufficient funds to purchase'
        }
    }

    return comparison;
}