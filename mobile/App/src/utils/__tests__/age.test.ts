import { calculateAge, checkCondition } from '../age';

describe('age utility', () => {
  beforeAll(() => {
    // Mock current date to 2026-03-09 for deterministic tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-09'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('calculates age correctly for adult', () => {
    expect(calculateAge('2000-01-01')).toBe(26);
    expect(calculateAge('1985-05-15')).toBe(40);
  });

  test('calculates age correctly for child', () => {
    expect(calculateAge('2018-07-25')).toBe(7);
  });

  test('handles string without dashes', () => {
    expect(calculateAge('20000101')).toBe(26);
  });

  test('checkCondition correctly identifies underage', () => {
    const liamTaylorDOB = '2018-07-25';
    expect(checkCondition(liamTaylorDOB, 'Age >= 18')).toBe(false);
  });

  test('checkCondition correctly identifies adult', () => {
    const seanMurphyDOB = '2000-01-01';
    expect(checkCondition(seanMurphyDOB, 'Age >= 18')).toBe(true);
  });
});
