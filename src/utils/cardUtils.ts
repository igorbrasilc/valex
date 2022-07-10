import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const cryptr = new Cryptr(process.env.ENCRYPT_KEY);
dayjs.extend(customParseFormat);

export async function checkIfCardExistsAndIsUnactiveAndExpirationDate(cardId: number) {
    const card = await checkIfCardExistsAndReturnCard(cardId);
    checkIfCardIsActive(card.password, 'toActivate');
    checkExpirationDate(card.expirationDate);

    return card;
}

export async function checkIfEmployeeExistsAndIfTypeIsntTaken(employeeId: number, company: companyRepository.Company, type: cardRepository.TransactionTypes) {
    const employee = await employeeRepository.findById(employeeId);

    const employeeTypeVerification = 
    employee?.companyId === company.id ?
    await cardRepository.findByTypeAndEmployeeId(type, employeeId) 
    : null;

    if (!employee || employeeTypeVerification === null) {
        throw {
            type: 'notFound',
            message: 'Employee not found in this company'
        }
    }

    if (employeeTypeVerification?.id) {
        throw {
            type: 'conflict',
            message: 'Employee already has this type of card'
        }
    }

    return employee;
}

export async function checkIfCardExistsAndReturnCard(cardId: number) {
    const card = await cardRepository.findById(cardId);

    if (card === undefined) {
        throw {
            type: 'notFound',
            message: 'Card not found'
        }
    }

     return card;
}

export function checkIfCardIsActive(cardPassword: string | undefined, intention: 'toRecharge' | 'toActivate') {

    if (intention === 'toActivate') {
        if (cardPassword !== null) {
            throw {
                type: 'conflict',
                message: 'Card already activated'
            }
        }
    }

    if (intention === 'toRecharge') {
        if (cardPassword === null) {
            throw {
                type: 'notAllowed',
                message: 'Card needs to be active to be recharged'
            }
        }
    }
}

export function checkExpirationDate(cardExpirationDate: string) {
    const dateDb = dayjs(cardExpirationDate, 'MM/YY').format('MM/YY');
    const dateNow = dayjs().format('MM/YY');
    const dateNowIsBeforeExpirationDate = dayjs(dateNow).isBefore(dateDb);

    if (!dateNowIsBeforeExpirationDate) {
        throw {
            type: 'notAllowed',
            message: 'This card already expired'
        }
    }
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

export function checkIfCardIsBlocked(cardIsBlocked: boolean) {
    if (cardIsBlocked) {
        throw {
            type: 'notAllowed',
            message: 'Card is already blocked'
        }
    }
}

export function checkIfCardIsUnblocked(cardIsBlocked: boolean) {
    if (!cardIsBlocked) {
        throw {
            type: 'notAllowed',
            message: 'Card is already unblocked'
        }
    }
}

export function hashPassword(userPassword: string, salt: number) {
    return bcrypt.hashSync(userPassword, salt);
}

export function unhashAndComparePasswords(userPassword: string, hashedPassword: string) {
    if (hashedPassword === null) {
        throw {
            type: 'notAllowed',
            message: 'Password was not created for this card yet'
        }
    }

    const comparison = bcrypt.compareSync(userPassword, hashedPassword);

    if (!comparison) {
        throw {
            type: 'unauthorized',
            message: 'Passwords do not match'
        }
    }
}