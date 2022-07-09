import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

export async function checkIfCardExistsAndIsUnactiveAndExpirationDate(cardId: number) {
    const card = await cardRepository.findById(cardId);

    if (!card) {
        throw {
            type: 'notFound',
            message: 'Card not found'
        }
    }

    if (card.password !== null) {
        throw {
            type: 'conflict',
            message: 'Card already activated'
        }
    }
    
    const dateDb = dayjs(card.expirationDate, 'MM/YY').format('MM/YY');
    const dateNow = dayjs().format('MM/YY');
    const dateNowIsBeforeExpirationDate = dayjs(dateNow).isBefore(dateDb);

    if (!dateNowIsBeforeExpirationDate) {
        throw {
            type: 'notAllowed',
            message: 'This card already expired'
        }
    }

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