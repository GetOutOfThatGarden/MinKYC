export interface MRZResult {
  documentNumber: string;
  dateOfBirth: string;
  expiryDate: string;
}

export function parseMRZ(lines: string[]): MRZResult {
  throw new Error('Not implemented');
}
