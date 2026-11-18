import { nanoid } from "nanoid";
import { fnv1a } from "../fnv1a";
export var VERCEL_AUTHENTICATED_PREFIX = 'v_';
/**
 * 1.0 -- random IDs from nanoid() with default length. Authenticated IDs are v_vercelUserID.
 */ export var IDENTITY_VERSION = '1.0';
export function generateRandomID() {
    return nanoid();
}
export function formatAuthenticatedID(vercelUserUid) {
    return "".concat(VERCEL_AUTHENTICATED_PREFIX).concat(vercelUserUid);
}
export function computeIdentityVersion() {
    return String(fnv1a(IDENTITY_VERSION));
}
