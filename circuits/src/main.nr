// MinKYC Zero-Knowledge Circuits with Commitment Verification
// Prototype: Age verification + Name matching + Identity binding
// Test-Driven Development

// ============================================
// MOCK TEST DATA (For Testing Only)
// ============================================

// Test User 1: 17 years old (should fail age check)
// Name: Emma Murphy (IRL)
// DOB: 2009-02-20 (17 years + 0 days)

// Test User 2: Exactly 18 (boundary case)
// Name: Sean O'Brien (IRL)
// DOB: 2008-02-20 (exactly 18)

// Test User 3: 25 years old (adult)
// Name: Niamh Ryan (IRL)
// DOB: 2001-02-20 (25 years old)

// Test User 4: 60 years old (senior)
// Name: James Kelly (IRL)
// DOB: 1966-02-20 (60 years old)

// ============================================
// TESTS FIRST (TDD Approach)
// ============================================

#[test]
fn test_over_18_valid_25_year_old() {
    // DOB: 2001-02-20 (25 years old in 2026)
    // Current: 2026-02-20
    assert(over_18_claim(20010220, 20260220));
}

#[test]
fn test_over_18_valid_60_year_old() {
    // DOB: 1966-02-20 (60 years old)
    assert(over_18_claim(19660220, 20260220));
}

#[test]
fn test_over_18_exactly_18() {
    // DOB: 2008-02-20 (exactly 18 today)
    assert(over_18_claim(20080220, 20260220));
}

#[test]
fn test_over_18_underage_17() {
    // DOB: 2009-02-20 (17 years old)
    assert(!over_18_claim(20090220, 20260220));
}

#[test]
fn test_over_17_years_364_days() {
    // DOB: 2008-02-21 (17 years + 364 days)
    assert(!over_18_claim(20080221, 20260220));
}

#[test]
fn test_name_match_identical() {
    let hash1 = 12345;
    let hash2 = 12345;
    assert(name_match_claim(hash1, hash2, 999));
}

#[test]
fn test_name_match_different() {
    let hash1 = 12345;
    let hash2 = 67890;
    assert(!name_match_claim(hash1, hash2, 999));
}

#[test]
fn test_commitment_valid() {
    // Mock: commitment = hash(dob || name_hash || secret)
    let dob: Field = 20010220;
    let name_hash: Field = 11111;
    let secret: Field = 99999;
    
    // This is a simplified check - in production would use proper hash
    let computed = compute_commitment(dob, name_hash, secret);
    assert(verify_commitment_binding(dob, name_hash, secret, computed));
}

#[test]
fn test_commitment_invalid_wrong_secret() {
    let dob: Field = 20010220;
    let name_hash: Field = 11111;
    let secret: Field = 99999;
    let wrong_commitment: Field = 12345; // Wrong commitment
    
    assert(!verify_commitment_binding(dob, name_hash, secret, wrong_commitment));
}

#[test]
fn test_full_verification_all_pass() {
    // Valid: 25-year-old, name matches, commitment valid
    let dob = 20010220;
    let name_hash = 11111;
    let secret = 99999;
    let commitment = compute_commitment(dob, name_hash, secret);
    
    let (age_ok, name_ok, commitment_ok) = minkyc_full_verification(
        dob, name_hash, name_hash, secret,
        20260220, 12345, commitment
    );
    
    assert(age_ok);
    assert(name_ok);
    assert(commitment_ok);
}

#[test]
fn test_full_verification_age_fails() {
    // Underage (17) but name matches, commitment valid
    let dob = 20090220; // 17 years old
    let name_hash = 11111;
    let secret = 99999;
    let commitment = compute_commitment(dob, name_hash, secret);
    
    let (age_ok, name_ok, commitment_ok) = minkyc_full_verification(
        dob, name_hash, name_hash, secret,
        20260220, 12345, commitment
    );
    
    assert(!age_ok);  // Age fails
    assert(name_ok);  // Name passes
    assert(commitment_ok); // Commitment valid
}

#[test]
fn test_full_verification_name_fails() {
    // Age OK but name doesn't match
    let dob = 20010220;
    let passport_hash = 11111;
    let submitted_hash = 22222;
    let secret = 99999;
    let commitment = compute_commitment(dob, passport_hash, secret);
    
    let (age_ok, name_ok, commitment_ok) = minkyc_full_verification(
        dob, passport_hash, submitted_hash, secret,
        20260220, 12345, commitment
    );
    
    assert(age_ok);
    assert(!name_ok);
    assert(commitment_ok);
}

#[test]
fn test_full_verification_commitment_fails() {
    // Age OK, name OK, but wrong commitment
    let dob = 20010220;
    let name_hash = 11111;
    let secret = 99999;
    let wrong_commitment = 12345; // Invalid
    
    let (age_ok, name_ok, commitment_ok) = minkyc_full_verification(
        dob, name_hash, name_hash, secret,
        20260220, 12345, wrong_commitment
    );
    
    assert(age_ok);
    assert(name_ok);
    assert(!commitment_ok);
}

// ============================================
// IMPLEMENTATION (After Tests)
// ============================================

/// Prove user is over 18 years old
fn over_18_claim(dob: Field, current_date: Field) -> bool {
    let dob_u: u64 = dob as u64;
    let current_u: u64 = current_date as u64;
    
    let current_year: u64 = current_u / 10000;
    let current_month_day: u64 = current_u % 10000;
    
    let cutoff_year: u64 = current_year - 18;
    let cutoff_date: u64 = (cutoff_year * 10000) + current_month_day;
    
    dob_u <= cutoff_date
}

/// Prove submitted name matches passport name
fn name_match_claim(
    passport_name_hash: Field,
    submitted_name_hash: Field,
    _salt: Field
) -> bool {
    passport_name_hash == submitted_name_hash
}

/// Compute commitment = hash(dob || name_hash || secret)
/// This mimics the on-chain commitment: SHA256(passport_data || secret)
fn compute_commitment(
    dob: Field,
    name_hash: Field,
    secret: Field
) -> Field {
    // Simplified commitment for prototype
    // In production: proper SHA256 of concatenated fields
    // (dob * 1000000) + (name_hash * 1000) + secret
    dob + name_hash + secret
}

/// Verify that the provided data matches the on-chain commitment
fn verify_commitment_binding(
    dob: Field,
    name_hash: Field,
    secret: Field,
    expected_commitment: Field
) -> bool {
    let computed = compute_commitment(dob, name_hash, secret);
    computed == expected_commitment
}

/// Full verification: Age + Name + Commitment
/// Links ZK proof to on-chain identity
fn minkyc_full_verification(
    // Private inputs
    dob: Field,
    passport_name_hash: Field,
    submitted_name_hash: Field,
    secret: Field,
    
    // Public inputs
    current_date: Field,
    salt: Field,
    commitment: Field
) -> (bool, bool, bool) {
    let age_ok = over_18_claim(dob, current_date);
    let name_ok = name_match_claim(passport_name_hash, submitted_name_hash, salt);
    let commitment_ok = verify_commitment_binding(dob, passport_name_hash, secret, commitment);
    
    (age_ok, name_ok, commitment_ok)
}

// ============================================
// MAIN ENTRY POINT
// ============================================

fn main(
    // Private inputs (kept secret)
    dob: Field,
    passport_name_hash: Field,
    submitted_name_hash: Field,
    secret: Field,
    
    // Public inputs (shared with verifier)
    current_date: pub Field,
    salt: pub Field,
    commitment: pub Field  // From on-chain Identity PDA
) -> pub (bool, bool, bool) {
    minkyc_full_verification(
        dob, passport_name_hash, submitted_name_hash, secret,
        current_date, salt, commitment
    )
}
