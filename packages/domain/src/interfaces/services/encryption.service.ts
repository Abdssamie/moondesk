/**
 * Service interface for encrypting/decrypting sensitive data
 */
export interface IEncryptionService {
  /**
   * Encrypt a plain text value
   * @returns Object containing the encrypted value and IV
   */
  encrypt(plainText: string): { encryptedValue: string; iv: string };

  /**
   * Decrypt an encrypted value
   */
  decrypt(encryptedValue: string, iv: string): string;
}
