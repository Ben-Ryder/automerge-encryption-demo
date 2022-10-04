import aes from "crypto-js/aes";
import sha256 from "crypto-js/sha256";
import {random} from "crypto-js/lib-typedarrays";
import utf8 from "crypto-js/enc-utf8";

/**
 * For this proof of concept I'm just hard coding a secret.
 * In a real app you'd either get this from the user or derive it from some secret the
 * user gives like the password (assuming you're not just sending the password to the server).
 * You could then ask for this on every load or save it locally depending on the application security model etc.
 */
export const encryptionSecret = "a very secure secret";


export class Encryption {
    // Basic Text Hashing
    static hashText(text: string): string {
        return sha256(text).toString();
    }

    // Basic Text Encryption
    static encryptText(key: string, text: string): string {
        try {
            return aes.encrypt(text, key).toString();
        }
        catch (e) {
            throw new Error("Encryption failed");
        }
    }

    static decryptText(key: string, cipherText: string): string {
        try {
            return aes.decrypt(cipherText, key).toString(utf8);
        }
        catch (e) {
            throw new Error("Decryption failed");
        }
    }

    // Basic Data Encryption
    static encryptData<Type>(key: string, data: Type): string {
        try {
            return aes.encrypt(JSON.stringify(data), key).toString();
        }
        catch (e) {
            throw new Error("Encryption failed");
        }
    }

    static decryptData<Type>(key: string, cipherText: string): Type {
        try {
            return JSON.parse(
                aes.decrypt(cipherText, key).toString(utf8)
            );
        }
        catch (e) {
            throw new Error("Decryption failed");
        }
    }
}
