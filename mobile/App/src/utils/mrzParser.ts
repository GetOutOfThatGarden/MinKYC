export interface MRZResult {
  documentNumber: string;
  dateOfBirth: string;
  expiryDate: string;
}

const weights = [7, 3, 1];

function getCharValue(char: string): number {
  if (char === '<') return 0;
  if (/[0-9]/.test(char)) return parseInt(char, 10);
  if (/[A-Z]/.test(char)) return char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
  return 0;
}

function calculateCheckDigit(data: string): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += getCharValue(data[i]) * weights[i % 3];
  }
  return sum % 10;
}

export function parseMRZ(lines: string[]): MRZResult {
  if (lines.length !== 2 || lines[0].length !== 44 || lines[1].length !== 44) {
    throw new Error('Invalid MRZ format');
  }

  const line2 = lines[1];

  const documentNumber = line2.substring(0, 9).replace(/</g, '');
  const documentNumberCD = parseInt(line2[9], 10);
  const dob = line2.substring(13, 19);
  const dobCD = parseInt(line2[19], 10);
  const expiryDate = line2.substring(21, 27);
  const expiryDateCD = parseInt(line2[27], 10);

  if (calculateCheckDigit(line2.substring(0, 9)) !== documentNumberCD) {
    throw new Error('Invalid check digit for document number');
  }

  if (calculateCheckDigit(dob) !== dobCD) {
    throw new Error('Invalid check digit for date of birth');
  }

  if (calculateCheckDigit(expiryDate) !== expiryDateCD) {
    throw new Error('Invalid check digit for expiry date');
  }

  return {
    documentNumber,
    dateOfBirth: dob,
    expiryDate,
  };
}
