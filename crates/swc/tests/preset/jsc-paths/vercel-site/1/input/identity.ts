import { nanoid } from 'nanoid';
import { fnv1a } from '../fnv1a';

export const VERCEL_AUTHENTICATED_PREFIX = 'v_';

/**
 * 1.0 -- random IDs from nanoid() with default length. Authenticated IDs are v_vercelUserID.
 */
export const IDENTITY_VERSION = '1.0';

export function generateRandomID(): string {
  return nanoid();
}

export function formatAuthenticatedID(vercelUserUid: string): string {
  return `${VERCEL_AUTHENTICATED_PREFIX}${vercelUserUid}`;
}

export function computeIdentityVersion(): string {
  return String(fnv1a(IDENTITY_VERSION));
}
