// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isFQDN.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

type FQDNOptions = {
  /**
   * @default true
   */
  requireTLD?: boolean;

  /**
   * @default false
   */
  allowUnderscores?: boolean;

  /**
   * @default false
   */
  allowTrailingDot?: boolean;
};

/**
 * @ignore
 */
const defaultFQDNOptions: FQDNOptions = {
  requireTLD: true,
  allowUnderscores: false,
  allowTrailingDot: false,
};

export const isFQDN = (str: string, options?: FQDNOptions) => {
  assertString(str);
  options = { ...defaultFQDNOptions, ...options };

  // Remove the optional trailing dot before checking validity
  if (options.allowTrailingDot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }

  const parts = str.split('.');

  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length > 63) {
      return false;
    }
  }

  if (options.requireTLD) {
    const tld = parts.pop() as string;

    if (
      !parts.length ||
      !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)
    ) {
      return false;
    }

    // disallow spaces && special characers
    if (
      /[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20\u00A9\uFFFD]/.test(
        tld
      )
    ) {
      return false;
    }
  }

  for (let part, i = 0; i < parts.length; i++) {
    part = parts[i];

    if (options.allowUnderscores) {
      part = part.replace(/_/g, '');
    }

    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }

    // disallow full-width chars
    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    }

    if (part[0] === '-' || part[part.length - 1] === '-') {
      return false;
    }
  }
  return true;
};
