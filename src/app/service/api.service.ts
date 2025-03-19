import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import {Observable} from "rxjs";




@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private static BASE_URL = 'http://localhost:8080/api';
  private static ENCRYPTION_KEY = 'my-encrytion-key';

  authStatusChanged = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  // Encrypt data and save to localStorage
  encryptAndSaveToStorage(key: string, value: string): void {
    const encryptedValue = CryptoJS.AES.encrypt(
      value,
      ApiService.ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(key, encryptedValue);
  }

  // Retrieve from localStorage and Decrypt
  private getFromStorageAndDecrypt(key: string): any {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return CryptoJS.AES.decrypt(
        encryptedValue,
        ApiService.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return null;
    }
  }

  private clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}
