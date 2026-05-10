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

export interface PassportProfile {
  data: PassportData;
  mrzLines: string[];
  description: string;
  documentNumber: string; // Aligned with MRZ and plan verification
}

export const MOCK_PROFILES: Record<string, PassportProfile> = {
  adult_irl: {
    description: 'Adult - Ireland (Valid)',
    documentNumber: 'PA1234567',
    data: {
      documentType: 'P',
      issuingCountry: 'IRL',
      passportNumber: 'PA1234567',
      surname: 'MURPHY',
      givenNames: 'SEAN',
      nationality: 'IRL',
      dateOfBirth: '1990-01-01',
      sex: 'M',
      expiryDate: '2030-01-01',
    },
    mrzLines: [
      'P<IRLMURPHY<<SEAN<<<<<<<<<<<<<<<<<<<<<<<<<<<',
      'PA1234567<7IRL9001014M3001014<<<<<<<<<<<<<<06',
    ],
  },
  adult_usa: {
    description: 'Adult - USA (Valid)',
    documentNumber: 'US9876543',
    data: {
      documentType: 'P',
      issuingCountry: 'USA',
      passportNumber: 'US9876543',
      surname: 'SMITH',
      givenNames: 'JAMES',
      nationality: 'USA',
      dateOfBirth: '1985-05-15',
      sex: 'M',
      expiryDate: '2032-05-15',
    },
    mrzLines: [
      'P<USASMITH<<JAMES<<<<<<<<<<<<<<<<<<<<<<<<<<<',
      'US9876543<8USA8505152M3205158<<<<<<<<<<<<<<04',
    ],
  },
  adult_gbr: {
    description: 'Adult - UK (Valid)',
    documentNumber: 'UK4567890',
    data: {
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
    mrzLines: [
      'P<GBRWILLIAMS<<EMMA<<<<<<<<<<<<<<<<<<<<<<<<<',
      'UK4567890<1GBR9211200F3211202<<<<<<<<<<<<<<08',
    ],
  },
  adult_deu: {
    description: 'Adult - Germany (Valid)',
    documentNumber: 'C12345678',
    data: {
      documentType: 'P',
      issuingCountry: 'DEU',
      passportNumber: 'C12345678',
      surname: 'MUELLER',
      givenNames: 'MAX',
      nationality: 'DEU',
      dateOfBirth: '1988-08-08',
      sex: 'M',
      expiryDate: '2028-08-08',
    },
    mrzLines: [
      'P<DEUMUELLER<<MAX<<<<<<<<<<<<<<<<<<<<<<<<<<<',
      'C12345678<9DEU8808085M2808088<<<<<<<<<<<<<<02',
    ],
  },
  adult_fra: {
    description: 'Adult - France (Valid)',
    documentNumber: 'FR2233445',
    data: {
      documentType: 'P',
      issuingCountry: 'FRA',
      passportNumber: 'FR2233445',
      surname: 'DUBOIS',
      givenNames: 'MARIE',
      nationality: 'FRA',
      dateOfBirth: '1994-04-14',
      sex: 'F',
      expiryDate: '2034-04-14',
    },
    mrzLines: [
      'P<FRADUBOIS<<MARIE<<<<<<<<<<<<<<<<<<<<<<<<<<',
      'FR2233445<5FRA9404143F3404146<<<<<<<<<<<<<<00',
    ],
  },
  minor_aus: {
    description: 'Minor - Australia (Under 18)',
    documentNumber: 'AU3334445',
    data: {
      documentType: 'P',
      issuingCountry: 'AUS',
      passportNumber: 'AU3334445',
      surname: 'TAYLOR',
      givenNames: 'LIAM',
      nationality: 'AUS',
      dateOfBirth: '2015-07-25',
      sex: 'M',
      expiryDate: '2025-07-25',
    },
    mrzLines: [
      'P<AUSTAYLOR<<LIAM<<<<<<<<<<<<<<<<<<<<<<<<<<<',
      'AU3334445<6AUS1507251M2507256<<<<<<<<<<<<<<03',
    ],
  },
  expired_mex: {
    description: 'Expired - Mexico',
    documentNumber: 'MX9988776',
    data: {
      documentType: 'P',
      issuingCountry: 'MEX',
      passportNumber: 'MX9988776',
      surname: 'GARCIA',
      givenNames: 'JUAN',
      nationality: 'MEX',
      dateOfBirth: '1970-10-10',
      sex: 'M',
      expiryDate: '2020-10-10',
    },
    mrzLines: [
      'P<MEXGARCIA<<JUAN<<<<<<<<<<<<<<<<<<<<<<<<<<<',
      'MX9988776<4MEX7010108M2010105<<<<<<<<<<<<<<01',
    ],
  },
};
