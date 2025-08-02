import crypto from 'crypto';

export function decryptMessage(encryptedText: string): string {
  const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  

  if (!secretKey) {
    throw new Error('ENCRYPTION_KEY environment variable is not set.');
  }

  if (secretKey.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 characters long.');
  }

  if (!encryptedText || !encryptedText.includes(':')) {
    throw new Error('Invalid encrypted text format.');
  }

  const [ivHex, encryptedHex] = encryptedText.split(':');

  if (!ivHex || !encryptedHex) {
    throw new Error('IV or encrypted text is missing.');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(secretKey, 'utf-8'),
    iv
  );

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

