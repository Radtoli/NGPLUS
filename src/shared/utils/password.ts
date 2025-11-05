import { randomBytes, pbkdf2 as _pbkdf2, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const pbkdf2 = promisify(_pbkdf2);

export async function hashPassword(password: string): Promise<string> {
  const pepper = process.env.PASSWORD_PEPPER || '';
  const iterations = Number(process.env.PBKDF2_ITERATIONS) || 100_000;
  const keylen = Number(process.env.PBKDF2_KEYLEN) || 64;
  const digest = process.env.PBKDF2_DIGEST || 'sha512';
  const saltLength = Number(process.env.PBKDF2_SALT_LENGTH) || 16;

  const salt = randomBytes(saltLength).toString('hex');
  const derivedKey = await pbkdf2(password + pepper, salt, iterations, keylen, digest);
  return `${iterations}.${salt}.${derivedKey.toString('hex')}`;
}


export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const pepper = process.env.PASSWORD_PEPPER || '';
  const parts = stored.split('.');
  if (parts.length !== 3) return false;
  const iterations = Number(parts[0]);
  const salt = parts[1];
  const hashHex = parts[2];
  const keylen = Number(process.env.PBKDF2_KEYLEN) || 64;
  const digest = process.env.PBKDF2_DIGEST || 'sha512';

  const derived = Buffer.from(await pbkdf2(password + pepper, salt, iterations, keylen, digest));
  const expected = Buffer.from(hashHex, 'hex');
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}
