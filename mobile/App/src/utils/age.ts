/**
 * Age Calculation Utility
 */

/**
 * Calculates current age from a birthdate string (YYYY-MM-DD or YYYYMMDD)
 */
export function calculateAge(birthDateStr: string): number {
  const normalized = birthDateStr.replace(/-/g, '');
  if (normalized.length !== 8) return 0;

  const year = parseInt(normalized.substring(0, 4), 10);
  const month = parseInt(normalized.substring(4, 6), 10) - 1; // 0-indexed
  const day = parseInt(normalized.substring(6, 8), 10);

  const birthDate = new Date(year, month, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Checks if a condition (e.g. "Age >= 18") is satisfied given a birthdate
 */
export function checkCondition(birthDateStr: string, condition: string): boolean {
  const age = calculateAge(birthDateStr);
  
  const normalizedCondition = condition.toLowerCase();
  
  if (normalizedCondition.includes('age >= 18')) {
    return age >= 18;
  }
  
  // Basic implementation for MVP
  // In production, use a proper parser for conditions
  return false;
}
