import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../config/config.js';

export function encrypt(data) {
  try {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
  } catch (error) {
    console.error('Error al encriptar:', error);
    throw error;
  }
}
