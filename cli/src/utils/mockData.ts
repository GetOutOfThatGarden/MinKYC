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

// Irish and Canadian passports for testing (user has both)
const COUNTRIES = ['IRL', 'CAN'] as const;

// Irish surnames
const IRL_SURNAMES = ['MURPHY', 'KELLY', 'O\'BRIEN', 'WALSH', 'RYAN', 'BYRNE', 'O\'SULLIVAN', 'MCCARTHY', 'DOYLE', 'KENNEDY', 'LYNCH', 'MURRAY', 'QUINN', 'MOORE', 'COLLINS', 'DUNNE', 'BRENNAN', 'BURKE'];
const IRL_GIVEN_NAMES = ['JAMES', 'MARY', 'JOHN', 'PATRICIA', 'MICHAEL', 'CATHERINE', 'SEAN', 'AOIFE', 'CONOR', 'CIARA', 'LIAM', 'SINEAD', 'CIAN', 'NIAMH', 'DANIEL', 'EMMA', 'DARRAGH', 'GRAINNE', 'FINN', 'ORLA'];

// Canadian surnames
const CAN_SURNAMES = ['SMITH', 'JOHNSON', 'WILLIAMS', 'BROWN', 'JONES', 'GARCIA', 'MILLER', 'DAVIS', 'RODRIGUEZ', 'MARTINEZ', 'WILSON', 'ANDERSON', 'THOMAS', 'TAYLOR', 'MOORE', 'JACKSON', 'MARTIN', 'LEE', 'THOMPSON', 'WHITE'];
const CAN_GIVEN_NAMES = ['JAMES', 'MARY', 'JOHN', 'PATRICIA', 'ROBERT', 'JENNIFER', 'MICHAEL', 'LINDA', 'WILLIAM', 'ELIZABETH', 'DAVID', 'BARBARA', 'RICHARD', 'SUSAN', 'JOSEPH', 'JESSICA', 'THOMAS', 'SARAH', 'CHARLES', 'KAREN'];

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

    // Randomly select country (IRL or CAN)
    const country = getRandomElement(COUNTRIES);
    
    // Use appropriate name lists
    const surnames = country === 'IRL' ? IRL_SURNAMES : CAN_SURNAMES;
    const givenNames = country === 'IRL' ? IRL_GIVEN_NAMES : CAN_GIVEN_NAMES;
    
    // Passport number format varies by country
    // IRL: 9 alphanumeric, CAN: typically 2 letters + 7 numbers
    const passportNumber = country === 'IRL' 
        ? generateRandomString(9, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
        : generateRandomString(2, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') + generateRandomString(7, '0123456789');

    return {
        documentType: "P",
        issuingCountry: country,
        passportNumber: passportNumber,
        surname: getRandomElement(surnames),
        givenNames: getRandomElement(givenNames),
        nationality: country,
        dateOfBirth: dateOfBirth,
        sex: getRandomElement(["M", "F", "X"]),
        expiryDate: expiryDate
    };
}
