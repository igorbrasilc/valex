import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardUtils from '../utils/cardUtils.js';
import { faker } from '@faker-js/faker';
import dayjs, { Dayjs } from 'dayjs';
import Cryptr from 'cryptr';
import bcrypt from 'bcrypt';

const cryptr = new Cryptr(process.env.ENCRYPT_KEY);

export async function 
createCard(
    employeeId: number, 
    company: companyRepository.Company, 
    type: cardRepository.TransactionTypes) {

    const employee = await cardUtils.checkIfEmployeeExistsAndIfTypeIsntTaken(employeeId, company, type);

    const cardData = generateCardData(employee, type);

    await cardRepository.insert(cardData);

    return cardData;
}

export async function updateCardPassword(unhashedPassword: string, cardId: number, securityCodeCVC: string) {

    const card = await cardUtils.checkIfCardExistsAndIsUnactiveAndExpirationDate(cardId);

    const CVCCheck = checkIfCVCIsTheSame(card.securityCode, securityCodeCVC);

    const hashedPassword = bcrypt.hashSync(unhashedPassword, 10);

    await cardRepository.update(cardId, {password: hashedPassword});
}

export function checkIfCVCIsTheSame(CVCFromDb: string, CVCInformed: string) {
    const decryptedCVC = cryptr.decrypt(CVCFromDb);

    if (decryptedCVC !== CVCInformed) {
        throw {
            type: 'unauthorized',
            message: 'CVC informed doesnt match the one saved for this account'
        }
    }

    return true;
}

export function formatEmployeeName(employeeName: string) {
    const nameSplitted = employeeName.split(' ');
    const nameFormatted = nameSplitted.map((partOfName, idx) => {
        if (idx === 0 || idx === nameSplitted.length - 1) {
            return partOfName.toUpperCase()
        } else {
            if (partOfName.length > 3) return partOfName[0].toUpperCase();
            else return '';
        }
    }).join(' ');

    return nameFormatted;
}

export function generateCardData(employee: employeeRepository.Employee, type: cardRepository.TransactionTypes) {
    const employeeNameFormatted = formatEmployeeName(employee.fullName);
    const randomCardNumber = faker.finance.creditCardNumber();
    const dateFromNow = dayjs().add(5, 'year').format('MM/YY');
    const uncryptedCVCGen = faker.finance.creditCardCVV();
    const encryptedCVC = cryptr.encrypt(uncryptedCVCGen);
    // const decryptedCVC = cryptr.decrypt(encryptedCVC);

    return {
        employeeId: employee.id,
        number: randomCardNumber,
        cardholderName: employeeNameFormatted,
        securityCode: encryptedCVC,
        expirationDate: dateFromNow,
        isVirtual: true,
        isBlocked: false,
        type: type
    }
}