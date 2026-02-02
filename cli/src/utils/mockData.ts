import crypto from 'crypto';

export interface MockPassportData {
    documentType: "P";
    issuingCountry: string;        // ISO 3166-1 alpha-3
    passportNumber: string;        // Realistic alphanumeric format
    surname: string;
    givenNames: string;
    nationality: string;           // ISO 3166-1 alpha-3
    dateOfBirth: string;           // YYYY-MM-DD
    sex: "M" | "F" | "X";
    expiryDate: string;            // YYYY-MM-DD
}

const COUNTRIES = ['USA', 'GBR', 'CAN', 'AUS', 'FRA', 'DEU', 'JPN', 'KOR', 'BRA', 'IND'];
const SURNAMES = ['SMITH', 'JOHNSON', 'WILLIAMS', 'BROWN', 'JONES', 'GARCIA', 'MILLER', 'DAVIS', 'RODRIGUEZ', 'MARTINEZ', 'HERNANDEZ', 'LOPEZ', 'GONZALEZ', 'WILSON', 'ANDERSON', 'THOMAS', 'TAYLOR', 'MOORE', 'JACKSON', 'MARTIN'];
const GIVEN_NAMES = ['JAMES', 'MARY', 'JOHN', 'PATRICIA', 'ROBERT', 'JENNIFER', 'MICHAEL', 'LINDA', 'WILLIAM', 'ELIZABETH', 'DAVID', 'BARBARA', 'RICHARD', 'SUSAN', 'JOSEPH', 'JESSICA', 'THOMAS', 'SARAH', 'CHARLES', 'KAREN'];

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start: Date, end: Date): string {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
}

function generateRandomString(length: number, chars: string): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function generateMockPassport(): MockPassportData {
    // Generate realistic DOB (18-90 years old)
    const now = new Date();
    const minAge = 18;
    const maxAge = 90;
    const dobStart = new Date(now.getFullYear() - maxAge, 0, 1);
    const dobEnd = new Date(now.getFullYear() - minAge, 11, 31);
    const dateOfBirth = getRandomDate(dobStart, dobEnd);

    // Generate Expiry Date (1-10 years in future)
    const expiryStart = new Date(now.getFullYear() + 1, 0, 1);
    const expiryEnd = new Date(now.getFullYear() + 10, 11, 31);
    const expiryDate = getRandomDate(expiryStart, expiryEnd);

    // Passport Number: 1 Letter + 7 Digits or similar
    // ICAO 9303 doesn't strictly define the format for all countries, but commonly 9 chars.
    // Let's use 9 alphanumeric characters.
    const passportNumber = generateRandomString(9, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

    const country = getRandomElement(COUNTRIES);

    return {
        documentType: "P",
        issuingCountry: country,
        passportNumber: passportNumber,
        surname: getRandomElement(SURNAMES),
        givenNames: getRandomElement(GIVEN_NAMES),
        nationality: country, // Keep consistent with issuing country for simplicity, though can differ
        dateOfBirth: dateOfBirth,
        sex: getRandomElement(["M", "F", "X"]),
        expiryDate: expiryDate
    };
}
