import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../config/config.js';

export function decrypt(encryptedData) {
  try {
    if (!encryptedData || typeof encryptedData !== 'string') return null;
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) return null;
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Error al desencriptar:', error);
    return null;
  }
}
