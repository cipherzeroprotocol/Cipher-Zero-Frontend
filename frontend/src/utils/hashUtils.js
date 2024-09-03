// src/utils/hashUtils.js
import crypto from 'crypto';

export const computeHash = (message, algorithm) => {
  return crypto.createHash(algorithm).update(message).digest('hex');
};
