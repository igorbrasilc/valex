import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import { faker } from '@faker-js/faker';
import dayjs, { Dayjs } from 'dayjs';
import Cryptr from 'cryptr';

const cryptr = new Cryptr(process.env.ENCRYPT_KEY);

export async function 
createCard(
    employeeId: number, 
    company: companyRepository.Company, 
    type: cardRepository.TransactionTypes) {

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

    const cardData = generateCardData(employee, type);

    await cardRepository.insert(cardData);

    return cardData;
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
    const randomCardNumber = faker.random.numeric(6);
    const dateFromNow = dayjs().add(5, 'year').format('MM/YY');
    const uncryptedCVCGen = faker.random.numeric(3);
    const encryptedCVC = cryptr.encrypt(uncryptedCVCGen);
    const decryptedCVC = cryptr.decrypt(encryptedCVC);

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