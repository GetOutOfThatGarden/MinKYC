import * as crypto from 'crypto';

export function hash(data: string): Buffer {
    return crypto.createHash('sha256').update(data).digest();
}

export function createCommitment(passport: any, secret: string): Buffer {
    // Sort keys to ensure deterministic JSON
    const sortedPassport = Object.keys(passport).sort().reduce((obj: any, key) => {
        obj[key] = passport[key];
        return obj;
    }, {});
    
    const data = JSON.stringify(sortedPassport) + secret;
    return hash(data);
}

export function generateMockProof(commitment: Buffer, request: any, secret: string): Buffer {
    const data = commitment.toString('hex') + JSON.stringify(request) + secret;
    return hash(data);
}

export function randomSecret(): string {
    return crypto.randomBytes(32).toString('hex');
}
