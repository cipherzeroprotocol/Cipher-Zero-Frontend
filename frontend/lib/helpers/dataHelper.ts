import { ethers } from 'ethers';
import crypto from 'crypto';

// Generate a unique identifier for content
export function generateContentID(content: Buffer): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Encrypt data using AES-256-CBC
export function encryptData(data: Buffer, key: Buffer): { iv: Buffer; encryptedData: Buffer } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encryptedData = cipher.update(data);
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);
  return { iv, encryptedData };
}

// Decrypt data using AES-256-CBC
export function decryptData(encryptedData: Buffer, key: Buffer, iv: Buffer): Buffer {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decryptedData = decipher.update(encryptedData);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);
  return decryptedData;
}

// Validate input data
export function validateInput(data: Buffer): boolean {
  // Example validation: ensure data is not empty
  return data.length > 0;
}

// Generate a random encryption key
export function generateEncryptionKey(): Buffer {
  return crypto.randomBytes(32); // AES-256 requires a 32-byte key
}

// Convert string to Buffer
export function stringToBuffer(str: string): Buffer {
  return Buffer.from(str, 'utf-8');
}

// Convert Buffer to string
export function bufferToString(buffer: Buffer): string {
  return buffer.toString('utf-8');
}