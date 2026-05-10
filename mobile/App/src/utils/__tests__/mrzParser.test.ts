import { parseMRZ } from '../mrzParser';

describe('mrzParser', () => {
  it('should parse a valid TD3 MRZ correctly', () => {
    const line1 = 'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<';
    const line2 = 'L898902C36UTO7408122F1204159ZE184226B<<<<<10';
    
    const result = parseMRZ([line1, line2]);
    
    expect(result).toEqual({
      documentNumber: 'L898902C3',
      dateOfBirth: '740812',
      expiryDate: '120415',
    });
  });

  it('should throw an error for invalid MRZ lines length', () => {
    expect(() => parseMRZ(['INVALID'])).toThrow('Invalid MRZ format');
  });

  it('should throw an error for invalid check digits', () => {
    const line1 = 'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<';
    const line2 = 'L898902C30UTO7408122F1204159ZE184226B<<<<<10'; // Invalid document number check digit (0 instead of 6)
    
    expect(() => parseMRZ([line1, line2])).toThrow('Invalid check digit');
  });
});
