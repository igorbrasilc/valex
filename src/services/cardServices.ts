import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardUtils from '../utils/cardUtils.js';
import bcrypt from 'bcrypt';

export async function 
createCard(
    employeeId: number, 
    company: companyRepository.Company, 
    type: cardRepository.TransactionTypes) {
    const employee = await cardUtils.checkIfEmployeeExistsAndIfTypeIsntTaken(employeeId, company, type);
    const cardData = cardUtils.generateCardData(employee, type);
    await cardRepository.insert(cardData);
    return cardData;
}

export async function updateCardPassword(unhashedPassword: string, cardId: number, securityCodeCVC: string) {
    const card = await cardUtils.checkIfCardExistsAndIsUnactiveAndExpirationDate(cardId);
    cardUtils.checkIfCVCIsTheSame(card.securityCode, securityCodeCVC);
    const hashedPassword = bcrypt.hashSync(unhashedPassword, 10);
    await cardRepository.update(cardId, {password: hashedPassword});
}

export async function blockCard(unhashedPassword: string, cardId: number) {

}