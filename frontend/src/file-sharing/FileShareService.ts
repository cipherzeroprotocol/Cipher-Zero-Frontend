// frontend/src/services/FileShareService.ts

import fs from 'fs';
import path from 'path';
import { encryptFile, decryptFile, generateKeyAndIV } from './EncryptionUtils';

// Define paths for encrypted and decrypted files
const ENCRYPTED_FILES_DIR = path.join(__dirname, '../encryptedFiles');
const DECRYPTED_FILES_DIR = path.join(__dirname, '../decryptedFiles');

// Ensure the directories exist
if (!fs.existsSync(ENCRYPTED_FILES_DIR)) {
    fs.mkdirSync(ENCRYPTED_FILES_DIR);
}
if (!fs.existsSync(DECRYPTED_FILES_DIR)) {
    fs.mkdirSync(DECRYPTED_FILES_DIR);
}

// Encrypt a file and save it to disk
export function encryptAndSaveFile(filePath: string, outputFileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) return reject(err);
            const { key, iv } = generateKeyAndIV();
            const encryptedData = encryptFile(data, key, iv);
            const outputFilePath = path.join(ENCRYPTED_FILES_DIR, outputFileName);
            
            fs.writeFile(outputFilePath, encryptedData, (err) => {
                if (err) return reject(err);
                // Save the key and IV securely, here it's saved to a text file for simplicity
                fs.writeFileSync(`${outputFilePath}.key`, `${key.toString('hex')}:${iv.toString('hex')}`);
                resolve();
            });
        });
    });
}

// Decrypt a file given its path and the key/IV path
export function decryptAndSaveFile(encryptedFilePath: string, keyIvFilePath: string, outputFileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.readFile(encryptedFilePath, (err, encryptedData) => {
            if (err) return reject(err);

            fs.readFile(keyIvFilePath, 'utf8', (err, keyIvData) => {
                if (err) return reject(err);
                
                const [keyHex, ivHex] = keyIvData.split(':');
                const key = Buffer.from(keyHex, 'hex');
                const iv = Buffer.from(ivHex, 'hex');

                try {
                    const decryptedData = decryptFile(encryptedData, key, iv);
                    const outputFilePath = path.join(DECRYPTED_FILES_DIR, outputFileName);
                    
                    fs.writeFile(outputFilePath, decryptedData, (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });
    });
}

// Example usage
if (require.main === module) {
    // Encrypt a file
    encryptAndSaveFile('path/to/your/file.txt', 'encryptedFile.enc')
        .then(() => console.log('File encrypted successfully'))
        .catch(err => console.error('Error encrypting file:', err));

    // Decrypt a file
    decryptAndSaveFile('path/to/your/encryptedFile.enc', 'path/to/your/encryptedFile.enc.key', 'decryptedFile.txt')
        .then(() => console.log('File decrypted successfully'))
        .catch(err => console.error('Error decrypting file:', err));
}
