use std;

/**
 * MinKYC Universal ZK Circuit (MVP Version)
 */

fn main(
    // --- Private Inputs ---
    dob: u64,
    secret_nonce: Field,
    
    // --- Public Inputs ---
    current_date: pub u64,
    verifier_id: pub Field,
    caller_pubkey: pub Field,
    commitment: pub Field 
) -> pub Field {
    
    // 1. Verify Commitment (Simple match for MVP demo)
    // In production: std::hash::pedersen_hash([dob as Field, secret_nonce])
    let computed_commitment = (dob as Field) + secret_nonce; 
    assert(computed_commitment == commitment);

    // 2. Perform Age Verification (Real logic)
    assert(over_18(dob, current_date));

    // 3. Generate Nullifier (Real ZK logic)
    let nullifier = std::hash::pedersen_hash([secret_nonce, verifier_id]);

    let _ = caller_pubkey;

    nullifier
}

fn over_18(dob: u64, current_date: u64) -> bool {
    let dob_year = dob / 10000;
    let dob_month_day = dob % 10000;
    let current_year = current_date / 10000;
    let current_month_day = current_date % 10000;
    
    let age = if current_month_day >= dob_month_day {
        current_year - dob_year
    } else {
        current_year - dob_year - 1
    };
    
    age >= 18
}

#[test]
fn test_valid_adult() {
    let dob = 19900101;
    let secret = 100;
    let current = 20260510;
    let verifier = 1;
    let caller = 999;
    let commitment = 19900101 + 100;
    
    let nullifier = main(dob, secret, current, verifier, caller, commitment);
    assert(nullifier != 0);
}
