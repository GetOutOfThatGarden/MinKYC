import { parseVerificationRequest, QRParseError } from '../qrParser';

describe('QR Parser utilities', () => {
  it('should parse a valid MinKYC QR string to a VerificationRequest object', () => {
    const validPayload = {
      minkyc: true,
      type: "verify_request",
      platformId: "socialprofile.xyz",
      requestId: "84fa1c92",
      condition: "age >= 18",
      userId: "John Smith"
    };

    const qrResult = parseVerificationRequest(JSON.stringify(validPayload));
    
    expect(qrResult).toEqual({
      platformId: "socialprofile.xyz",
      requestId: "84fa1c92",
      condition: "age >= 18",
      userId: "John Smith"
    });
  });

  it('should throw QRParseError for non-JSON strings', () => {
    expect(() => parseVerificationRequest('just some random text')).toThrow(QRParseError);
    expect(() => parseVerificationRequest('just some random text')).toThrow(/Invalid JSON format/);
  });

  it('should throw QRParseError for valid JSON that is not a MinKYC request', () => {
    const invalidPayload1 = { name: "John", age: 18 };
    expect(() => parseVerificationRequest(JSON.stringify(invalidPayload1))).toThrow(QRParseError);
    expect(() => parseVerificationRequest(JSON.stringify(invalidPayload1))).toThrow(/Not a valid MinKYC request/);

    const invalidPayload2 = { minkyc: true, type: "some_other_type" };
    expect(() => parseVerificationRequest(JSON.stringify(invalidPayload2))).toThrow(QRParseError);
    expect(() => parseVerificationRequest(JSON.stringify(invalidPayload2))).toThrow(/Not a valid MinKYC request/);
  });

  it('should throw QRParseError if required fields are missing', () => {
    const missingFieldsPayload = {
      minkyc: true,
      type: "verify_request",
      // platformId is missing
      requestId: "123",
      condition: "age >= 18",
      userId: "Test User"
    };

    expect(() => parseVerificationRequest(JSON.stringify(missingFieldsPayload))).toThrow(QRParseError);
    expect(() => parseVerificationRequest(JSON.stringify(missingFieldsPayload))).toThrow(/Missing required fields/);
  });
});
