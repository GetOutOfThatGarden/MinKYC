export interface PassportData {
    documentType: string;
    issuingCountry: string;
    passportNumber: string;
    surname: string;
    givenNames: string;
    nationality: string;
    dateOfBirth: string; // YYYY-MM-DD
    sex: string; // M, F, or X
    expiryDate: string; // YYYY-MM-DD
}

export const MOCK_PROFILES: Record<string, PassportData> = {
    profile1: {
        documentType: 'P',
        issuingCountry: 'IRL',
        passportNumber: 'PA1234567',
        surname: 'MURPHY',
        givenNames: 'SEAN',
        nationality: 'IRL',
        dateOfBirth: '2000-01-01',
        sex: 'M',
        expiryDate: '2029-01-01',
    },
    profile2: {
        documentType: 'P',
        issuingCountry: 'USA',
        passportNumber: 'US9876543',
        surname: 'SMITH',
        givenNames: 'JAMES',
        nationality: 'USA',
        dateOfBirth: '1985-05-15',
        sex: 'M',
        expiryDate: '2030-05-15',
    },
    profile3: {
        documentType: 'P',
        issuingCountry: 'GBR',
        passportNumber: 'UK4567890',
        surname: 'WILLIAMS',
        givenNames: 'EMMA',
        nationality: 'GBR',
        dateOfBirth: '1992-11-20',
        sex: 'F',
        expiryDate: '2032-11-20',
    },
    profile4: {
        documentType: 'P',
        issuingCountry: 'PRK',
        passportNumber: 'NK1112223',
        surname: 'KIM',
        givenNames: 'SUN',
        nationality: 'PRK',
        dateOfBirth: '1995-03-10',
        sex: 'F',
        expiryDate: '2028-03-10',
    },
    profile5: {
        documentType: 'P',
        issuingCountry: 'AUS',
        passportNumber: 'AU3334445',
        surname: 'TAYLOR',
        givenNames: 'LIAM',
        nationality: 'AUS',
        dateOfBirth: '2018-07-25', // 8 years old
        sex: 'M',
        expiryDate: '2022-07-25', // Expired
    },
};
