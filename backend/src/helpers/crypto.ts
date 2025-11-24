import crypto from "crypto";

const ALGO = "aes-256-gcm";
// node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

const KEY = Buffer.from("x/N0bRcQlKmh0ekHRFmQs55BGlir66TUHSLN7Bk+Mc8=", "base64"); // 32 bytes
const IV_LENGTH = 16;

/** Encrypt text and return SINGLE string */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  const tag = cipher.getAuthTag();

  // Combine everything into one Base64 string
  const combined = Buffer.concat([
    iv,
    tag,
    Buffer.from(encrypted, "base64")
  ]);

  return combined.toString("base64");
}

export function decrypt(encryptedString: string): string {
  const data = Buffer.from(encryptedString, "base64");

  const iv = data.subarray(0, 16);
  const tag = data.subarray(16, 32);
  const ciphertext = data.subarray(32);

  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);

  decipher.setAuthTag(tag);

  // Convert ciphertext Buffer → Base64 string
  const ciphertextBase64 = ciphertext.toString("base64");

  let decrypted = decipher.update(ciphertextBase64, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}




const secret = "hello world";

const encrypted = encrypt(secret);
console.log("Encrypted:", encrypted);  // single string

const decrypted = decrypt(encrypted);
console.log("Decrypted:", decrypted);  // "hello world"
