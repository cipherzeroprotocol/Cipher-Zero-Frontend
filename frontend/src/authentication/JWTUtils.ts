import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

// Define a secret key for signing and verifying JWTs
const SECRET_KEY = 'your-secret-key'; // Replace this with a secure key

export const JWTUtils = {
  /**
   * Generates a JWT token.
   * @param {object} payload - The payload to include in the token.
   * @param {SignOptions} [options] - Optional sign options (e.g., expiration time).
   * @returns {string} The generated JWT token.
   */
  generateToken(payload: object, options?: SignOptions): string {
    return jwt.sign(payload, SECRET_KEY, options);
  },

  /**
   * Verifies a JWT token.
   * @param {string} token - The JWT token to verify.
   * @param {VerifyOptions} [options] - Optional verify options (e.g., audience, issuer).
   * @returns {object | string} The decoded payload if the token is valid.
   * @throws {Error} If the token is invalid or verification fails.
   */
  verifyToken(token: string, options?: VerifyOptions): JwtPayload | string {
    try {
      return jwt.verify(token, SECRET_KEY, options) as JwtPayload | string;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },

  /**
   * Decodes a JWT token without verifying it.
   * @param {string} token - The JWT token to decode.
   * @returns {object | null} The decoded payload or null if the token is invalid.
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload | null;
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  },

  /**
   * Checks if a JWT token is expired.
   * @param {string} token - The JWT token to check.
   * @returns {boolean} True if the token is expired, false otherwise.
   */
  isTokenExpired(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    
    if (decodedToken && 'exp' in decodedToken) {
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp !== undefined && decodedToken.exp < currentTime;
    }
    
    return true; // Assume expired if no expiration claim exists
  }
};