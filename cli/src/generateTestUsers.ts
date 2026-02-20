import { generateMockPassport } from './utils/mockData';
import * as fs from 'fs';
import * as path from 'path';
import { randomSecret, createCommitment } from './utils/crypto';

// Generate specific test users for ZK testing

interface TestUser {
    id: string;
    name: string;
    description: string;
    expectedAgeCheck: boolean;
    passport: any;
    secret: string;
    commitment: Buffer;
}

// User 1: 17 years old (should FAIL age check)
const user17 = {
    id: "test-user-17",
    name: "Emma Murphy",
    description: "17 years old - Should FAIL over-18 check",
    expectedAgeCheck: false,
    passport: {
        documentType: "P",
        issuingCountry: "IRL",
        passportNumber: "EMMA20092",
        surname: "MURPHY",
        givenNames: "EMMA",
        nationality: "IRL",
        dateOfBirth: "2009-02-20", // 17 years old
        sex: "F",
        expiryDate: "2034-02-20"
    }
};

// User 2: Exactly 18 years old (boundary case)
const user18 = {
    id: "test-user-18",
    name: "Sean O'Brien",
    description: "Exactly 18 years old - Should PASS over-18 check",
    expectedAgeCheck: true,
    passport: {
        documentType: "P",
        issuingCountry: "IRL",
        passportNumber: "SEAN20082",
        surname: "O'BRIEN",
        givenNames: "SEAN",
        nationality: "IRL",
        dateOfBirth: "2008-02-20", // Exactly 18
        sex: "M",
        expiryDate: "2033-02-20"
    }
};

// User 3: 25 years old (adult)
const user25 = {
    id: "test-user-25",
    name: "Niamh Ryan",
    description: "25 years old - Should PASS over-18 check",
    expectedAgeCheck: true,
    passport: {
        documentType: "P",
        issuingCountry: "IRL",
        passportNumber: "NIAMH2001",
        surname: "RYAN",
        givenNames: "NIAMH",
        nationality: "IRL",
        dateOfBirth: "2001-02-20", // 25 years old
        sex: "F",
        expiryDate: "2031-02-20"
    }
};

// User 4: 60 years old (senior)
const user60 = {
    id: "test-user-60",
    name: "James Kelly",
    description: "60 years old - Should PASS over-18 check",
    expectedAgeCheck: true,
    passport: {
        documentType: "P",
        issuingCountry: "IRL",
        passportNumber: "JAMES1966",
        surname: "KELLY",
        givenNames: "JAMES",
        nationality: "IRL",
        dateOfBirth: "1966-02-20", // 60 years old
        sex: "M",
        expiryDate: "2026-02-20"
    }
};

// Generate secrets and commitments for each user
function generateTestUser(user: any): TestUser {
    const secret = randomSecret();
    const commitment = createCommitment(user.passport, secret);
    
    return {
        ...user,
        secret,
        commitment
    };
}

// Generate all test users
const testUsers: TestUser[] = [
    generateTestUser(user17),
    generateTestUser(user18),
    generateTestUser(user25),
    generateTestUser(user60)
];

// Save to file
const outputPath = path.join(__dirname, '..', 'test-users.json');
fs.writeFileSync(outputPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    currentDate: "2026-02-20",
    testUsers: testUsers.map(u => ({
        id: u.id,
        name: u.name,
        description: u.description,
        expectedAgeCheck: u.expectedAgeCheck,
        passport: u.passport,
        secret: u.secret,
        commitment: u.commitment.toString('hex'),
        // ZK circuit inputs
        zkInputs: {
            dob: u.passport.dateOfBirth.replace(/-/g, ''), // YYYYMMDD format
            nameHash: "11111", // Placeholder - would be computed
            secret: u.secret
        }
    }))
}, null, 2));

console.log(`✅ Generated ${testUsers.length} test users`);
console.log(`📁 Saved to: ${outputPath}`);
console.log('\nTest Users:');
testUsers.forEach(u => {
    const age = 2026 - parseInt(u.passport.dateOfBirth.split('-')[0]);
    console.log(`  • ${u.name} (${age} years) - ${u.expectedAgeCheck ? 'PASS' : 'FAIL'} age check`);
});
