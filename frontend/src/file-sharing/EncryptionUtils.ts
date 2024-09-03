// frontend/src/utils/EncryptionUtil.ts

import crypto from 'crypto';

const algorithm = 'aes-256-cbc'; // AES algorithm with 256-bit key and CBC mode
const key = crypto.randomBytes(32); // Generate a random 256-bit key
const iv = crypto.randomBytes(16); // Generate a random initialization vector

// Function to encrypt a file
export function encryptFile(data: Buffer, key: Buffer, iv: Buffer): Buffer {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return encrypted;
}

// Function to decrypt a file
export function decryptFile(encryptedData: Buffer, key: Buffer, iv: Buffer): Buffer {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted;
}

// Function to generate a random key and IV
export function generateKeyAndIV(): { key: Buffer, iv: Buffer } {
    return {
        key: crypto.randomBytes(32), // Generate a new random key
        iv: crypto.randomBytes(16)   // Generate a new random IV
    };
}

