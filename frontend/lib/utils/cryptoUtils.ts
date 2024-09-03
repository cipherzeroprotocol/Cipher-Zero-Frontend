import crypto from 'crypto';

// Hash a string using SHA-256
export function sha256Hash(input: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

// Generate a random cryptographic key
export function generateCryptoKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Encrypt a string using AES-256-CBC
export function encryptAES(input: string, key: string): string {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(input, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt an AES-256-CBC encrypted string
export function decryptAES(input: string, key: string): string {
  const parts = input.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}