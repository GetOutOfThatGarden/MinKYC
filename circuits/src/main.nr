// MinKYC Zero-Knowledge Circuits
// Prototype: Age verification + Name matching
// Test-Driven Development

// ============================================
// TESTS FIRST (TDD Approach)
// ============================================

#[test]
fn test_over_18_valid() {
    // DOB: 1990-01-01 (36 years old in 2026)
    // Current: 2026-02-20
    // Should pass
    assert(over_18_claim(19900101, 20260220));
}

#[test]
fn test_over_18_exactly_18() {
    // DOB: 2008-02-20 (exactly 18 today)
    // Should pass
    assert(over_18_claim(20080220, 20260220));
}

#[test]
fn test_over_18_underage() {
    // DOB: 2010-01-01 (16 years old)
    // Should fail
    assert(!over_18_claim(20100101, 20260220));
}

#[test]
fn test_over_17_years_364_days() {
    // DOB: 2008-02-21 (17 years + 364 days)
    // Should fail (not yet 18)
    assert(!over_18_claim(20080221, 20260220));
}

#[test]
fn test_name_match_identical() {
    // Same name, same salt
    let hash1 = 12345; // pretend hash of "john smith" + salt
    let hash2 = 12345;
    assert(name_match_claim(hash1, hash2, 999));
}

#[test]
fn test_name_match_different() {
    // Different names
    let hash1 = 12345; // "john smith"
    let hash2 = 67890; // "jane doe"
    assert(!name_match_claim(hash1, hash2, 999));
}

#[test]
fn test_full_verification_both_pass() {
    // Valid: 25-year-old, name matches
    let dob = 20000101;        // 25 years old
    let name_hash = 11111;     // same hash for both
    let current_date = 20260220;
    let salt = 12345;
    
    let (age_ok, name_ok) = minkyc_verification(
        dob, name_hash, name_hash, current_date, salt
    );
    
    assert(age_ok);
    assert(name_ok);
}

#[test]
fn test_full_verification_age_fails() {
    // Underage but name matches
    let dob = 20100101;        // 16 years old
    let name_hash = 11111;
    let current_date = 20260220;
    let salt = 12345;
    
    let (age_ok, name_ok) = minkyc_verification(
        dob, name_hash, name_hash, current_date, salt
    );
    
    assert(!age_ok);  // Age fails
    assert(name_ok);  // Name passes
}

#[test]
fn test_full_verification_name_fails() {
    // Age OK but name doesn't match
    let dob = 20000101;        // 25 years old
    let passport_hash = 11111; // "john smith"
    let submitted_hash = 22222; // "jane doe"
    let current_date = 20260220;
    let salt = 12345;
    
    let (age_ok, name_ok) = minkyc_verification(
        dob, passport_hash, submitted_hash, current_date, salt
    );
    
    assert(age_ok);   // Age passes
    assert(!name_ok); // Name fails
}

// ============================================
// IMPLEMENTATION (After Tests)
// ============================================

/// Prove user is over 18 years old
/// 
/// # Arguments
/// * `dob` - Date of birth in YYYYMMDD format (private)
/// * `current_date` - Today's date in YYYYMMDD format (public)
/// 
/// # Returns
/// * `bool` - true if user is >= 18 years old
fn over_18_claim(dob: Field, current_date: Field) -> bool {
    // Calculate the cutoff date (18 years ago from current_date)
    // Using integer arithmetic compatible with Field types
    
    // Convert to u64 for date arithmetic
    let dob_u: u64 = dob as u64;
    let current_u: u64 = current_date as u64;
    
    // Extract year (first 4 digits)
    let current_year: u64 = current_u / 10000;
    let current_month_day: u64 = current_u % 10000;
    
    let cutoff_year: u64 = current_year - 18;
    let cutoff_date: u64 = (cutoff_year * 10000) + current_month_day;
    
    // User must be born ON or BEFORE the cutoff date
    dob_u <= cutoff_date
}

/// Prove submitted name matches passport name
/// 
/// # Arguments
/// * `passport_name_hash` - Hash of name from passport (private)
/// * `submitted_name_hash` - Hash of name user entered (private)
/// * `salt` - Salt used for hashing (public, prevents replay attacks)
/// 
/// # Returns
/// * `bool` - true if hashes match (names are identical)
fn name_match_claim(
    passport_name_hash: Field,
    submitted_name_hash: Field,
    _salt: Field
) -> bool {
    // In production, you'd verify both hashes were computed with the same salt
    // For prototype, simple equality check (hashing done client-side)
    passport_name_hash == submitted_name_hash
}

/// Combined verification: Age + Name
/// 
/// # Arguments (Private)
/// * `dob` - Date of birth
/// * `passport_name_hash` - Hash of passport name
/// * `submitted_name_hash` - Hash of submitted name
/// 
/// # Arguments (Public)
/// * `current_date` - Today's date
/// * `salt` - Salt for name hashing
/// 
/// # Returns
/// * `(bool, bool)` - (age_ok, name_ok)
fn minkyc_verification(
    dob: Field,
    passport_name_hash: Field,
    submitted_name_hash: Field,
    current_date: Field,
    _salt: Field
) -> (bool, bool) {
    let age_ok = over_18_claim(dob, current_date);
    let name_ok = name_match_claim(passport_name_hash, submitted_name_hash, _salt);
    
    (age_ok, name_ok)
}

// ============================================
// MAIN ENTRY POINT (for nargo prove)
// ============================================

fn main(
    // Private inputs (hidden from verifier)
    dob: Field,
    passport_name_hash: Field,
    submitted_name_hash: Field,
    
    // Public inputs (known to verifier)
    current_date: pub Field,
    salt: pub Field
) -> pub (bool, bool) {
    minkyc_verification(dob, passport_name_hash, submitted_name_hash, current_date, salt)
}
