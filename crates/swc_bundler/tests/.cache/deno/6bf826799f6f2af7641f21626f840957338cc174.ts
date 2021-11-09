// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isEmail.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';
// @ts-ignore allowing typedoc to build
import { isByteLength } from './isByteLength.ts';
// @ts-ignore allowing typedoc to build
import { isFQDN } from './isFQDN.ts';
// @ts-ignore allowing typedoc to build
import { isIP } from './isIP.ts';

type EmailOptions = {
  /**
   * If set to `true`, the validator will also match `Display Name <email-address>`.
   *
   * @default false
   */
  allowDisplayName?: boolean;

  /**
   * If set to `true`, the validator will reject strings without the format `Display Name <email-address>`.
   *
   * @default false
   */
  requireDisplayName?: boolean;

  /**
   * If set to `false`, the validator will not allow any non-English UTF8 character in email address' local part.
   *
   * @default true
   */
  allowUTF8LocalPart?: boolean;

  /**
   * If set to `false`, e-mail addresses without having TLD in their domain will also be matched.
   *
   * @default true
   */
  requireTLD?: boolean;

  /**
   * If set to `true`, the validator will not check for the standard max length of an email.
   *
   * @default false
   */
  ignoreMaxLength?: boolean;

  /**
   * If set to `true`, the validator will allow IP addresses in the host part.
   *
   * @default false
   */
  allowIPDomain?: boolean;

  /**
   * If set to `true`, some additional validation will be enabled,
   * e.g. disallowing certain syntactically valid email addresses that are rejected by GMail.
   *
   * @default false
   */
  domainSpecificValidation?: boolean;
};

/**
 * @ignore
 */
const defaultEmailOptions: EmailOptions = {
  allowDisplayName: false,
  requireDisplayName: false,
  allowUTF8LocalPart: true,
  requireTLD: true,
  ignoreMaxLength: false,
  allowIPDomain: false,
  domainSpecificValidation: false,
};

/**
 * @ignore
 */
const splitNameAddress = /^([^\x00-\x1F\x7F-\x9F\cX]+)<(.+)>$/i;

/**
 * @ignore
 */
const emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;

/**
 * @ignore
 */
const gmailUserPart = /^[a-z\d]+$/;

/**
 * @ignore
 */
const quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;

/**
 * @ignore
 */
const emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;

/**
 * @ignore
 */
const quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;

/**
 * @ignore
 */
const defaultMaxEmailLength = 254;

/**
 * Validating the displayName according to RFC2822
 * @param displayName
 * @see https://tools.ietf.org/html/rfc2822#appendix-A.1.2
 *
 * @ignore
 */
export const validateDisplayName = (displayName: string) => {
  const trimQuotes = displayName.match(/^"(.+)"$/i);
  const displayNameWithoutQuotes = trimQuotes ? trimQuotes[1] : displayName;

  // display name with only spaces is not valid
  if (!displayNameWithoutQuotes.trim()) {
    return false;
  }

  // check whether display name contains illegal character
  const containsIllegal = /[\.";<>]/.test(displayNameWithoutQuotes);

  if (containsIllegal) {
    // if contains illegal characters,
    // must to be enclosed in double-quotes, otherwise it's not a valid display name
    if (!trimQuotes) {
      return false;
    }

    // the quotes in display name must start with character symbol \
    const allStartWithBackSlash =
      displayNameWithoutQuotes.split('"').length ===
      displayNameWithoutQuotes.split('\\"').length;
    if (!allStartWithBackSlash) {
      return false;
    }
  }

  return true;
};

/**
 * Checks if the input is an email or not.
 * Gives options to check emails with display names as well.
 *
 * @example
 * ```ts
 * import {segno} from 'https://deno.land/x/segno/mod.ts';
 *
 * segno.isEmail('foo@bar.com'); // true
 * segno.isEmail('multiple..dots@stillinvalid.com'); // false
 * ```
 */
export const isEmail = (email: string, options?: EmailOptions) => {
  assertString(email);
  options = { ...defaultEmailOptions, ...options };

  if (options.requireDisplayName || options.allowDisplayName) {
    const displayEmail = email.match(splitNameAddress);

    if (displayEmail) {
      let displayName;
      [, displayName, email] = displayEmail;
      // sometimes need to trim the last space to get the display name
      // because there may be a space between display name and email address
      // eg. myname <address@gmail.com>
      // the display name is `myname` instead of `myname `, so need to trim the last space
      if (displayName.endsWith(' ')) {
        displayName = displayName.substr(0, displayName.length - 1);
      }

      if (!validateDisplayName(displayName)) {
        return false;
      }
    } else if (options.requireDisplayName) {
      return false;
    }
  }
  if (!options.ignoreMaxLength && email.length > defaultMaxEmailLength) {
    return false;
  }

  const parts = email.split('@');
  const domain = parts.pop() as string;
  let user = parts.join('@');

  const lowerDomain = domain.toLowerCase();

  if (
    options.domainSpecificValidation &&
    (lowerDomain === 'gmail.com' || lowerDomain === 'googlemail.com')
  ) {
    /*
      Previously we removed dots for gmail addresses before validating.
      This was removed because it allows `multiple..dots@gmail.com`
      to be reported as valid, but it is not.
      Gmail only normalizes single dots, removing them from here is pointless,
      should be done in normalizeEmail
    */
    user = user.toLowerCase();

    // Removing sub-address from username before gmail validation
    const username = user.split('+')[0];

    // Dots are not included in gmail length restriction
    if (!isByteLength(username.replace('.', ''), { min: 6, max: 30 })) {
      return false;
    }

    const userParts = username.split('.');
    for (let i = 0; i < userParts.length; i++) {
      if (!gmailUserPart.test(userParts[i])) {
        return false;
      }
    }
  }

  if (!isByteLength(user, { max: 64 }) || !isByteLength(domain, { max: 254 })) {
    return false;
  }

  if (!isFQDN(domain, { requireTLD: options.requireTLD })) {
    if (!options.allowIPDomain) {
      return false;
    }

    if (!isIP(domain)) {
      if (!domain.startsWith('[') || !domain.endsWith(']')) {
        return false;
      }

      const noBracketdomain = domain.substr(1, domain.length - 2);

      if (noBracketdomain.length === 0 || !isIP(noBracketdomain)) {
        return false;
      }
    }
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allowUTF8LocalPart
      ? quotedEmailUserUtf8.test(user)
      : quotedEmailUser.test(user);
  }

  const userParts = user.split('.');
  const pattern = options.allowUTF8LocalPart
    ? emailUserUtf8Part
    : emailUserPart;

  for (let i = 0; i < userParts.length; i++) {
    if (!pattern.test(userParts[i])) {
      return false;
    }
  }

  return true;
};
