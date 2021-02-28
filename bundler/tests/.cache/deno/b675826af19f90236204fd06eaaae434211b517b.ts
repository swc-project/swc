// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isPassportNumber.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

type CountryCode =
  | 'AM'
  | 'AR'
  | 'AT'
  | 'AU'
  | 'BE'
  | 'BG'
  | 'CA'
  | 'CH'
  | 'CN'
  | 'CY'
  | 'CZ'
  | 'DE'
  | 'DK'
  | 'DZ'
  | 'EE'
  | 'ES'
  | 'FI'
  | 'FR'
  | 'GB'
  | 'GR'
  | 'HR'
  | 'HU'
  | 'IE'
  | 'IN'
  | 'IS'
  | 'IT'
  | 'JP'
  | 'KR'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'MT'
  | 'NL'
  | 'PO'
  | 'PT'
  | 'RO'
  | 'SE'
  | 'SL'
  | 'SK'
  | 'TR'
  | 'UA'
  | 'US';

/**
 * Reference:
 * https://en.wikipedia.org/ -- Wikipedia
 * https://docs.microsoft.com/en-us/microsoft-365/compliance/eu-passport-number -- EU Passport Number
 * https://countrycode.org/ -- Country Codes
 */
/**
 * @ignore
 */
const passportRegexByCountryCode = {
  AM: /^[A-Z]{2}\d{7}$/, // ARMENIA
  AR: /^[A-Z]{3}\d{6}$/, // ARGENTINA
  AT: /^[A-Z]\d{7}$/, // AUSTRIA
  AU: /^[A-Z]\d{7}$/, // AUSTRALIA
  BE: /^[A-Z]{2}\d{6}$/, // BELGIUM
  BG: /^\d{9}$/, // BULGARIA
  CA: /^[A-Z]{2}\d{6}$/, // CANADA
  CH: /^[A-Z]\d{7}$/, // SWITZERLAND
  CN: /^[GE]\d{8}$/, // CHINA [G=Ordinary, E=Electronic] followed by 8-digits
  CY: /^[A-Z](\d{6}|\d{8})$/, // CYPRUS
  CZ: /^\d{8}$/, // CZECH REPUBLIC
  DE: /^[CFGHJKLMNPRTVWXYZ0-9]{9}$/, // GERMANY
  DK: /^\d{9}$/, // DENMARK
  DZ: /^\d{9}$/, // ALGERIA
  EE: /^([A-Z]\d{7}|[A-Z]{2}\d{7})$/, // ESTONIA (K followed by 7-digits), e-passports have 2 UPPERCASE followed by 7 digits
  ES: /^[A-Z0-9]{2}([A-Z0-9]?)\d{6}$/, // SPAIN
  FI: /^[A-Z]{2}\d{7}$/, // FINLAND
  FR: /^\d{2}[A-Z]{2}\d{5}$/, // FRANCE
  GB: /^\d{9}$/, // UNITED KINGDOM
  GR: /^[A-Z]{2}\d{7}$/, // GREECE
  HR: /^\d{9}$/, // CROATIA
  HU: /^[A-Z]{2}(\d{6}|\d{7})$/, // HUNGARY
  IE: /^[A-Z0-9]{2}\d{7}$/, // IRELAND
  IN: /^[A-Z]{1}-?\d{7}$/, // INDIA
  IS: /^(A)\d{7}$/, // ICELAND
  IT: /^[A-Z0-9]{2}\d{7}$/, // ITALY
  JP: /^[A-Z]{2}\d{7}$/, // JAPAN
  KR: /^[MS]\d{8}$/, // SOUTH KOREA, REPUBLIC OF KOREA, [S=PS Passports, M=PM Passports]
  LT: /^[A-Z0-9]{8}$/, // LITHUANIA
  LU: /^[A-Z0-9]{8}$/, // LUXEMBURG
  LV: /^[A-Z0-9]{2}\d{7}$/, // LATVIA
  MT: /^\d{7}$/, // MALTA
  NL: /^[A-Z]{2}[A-Z0-9]{6}\d$/, // NETHERLANDS
  PO: /^[A-Z]{2}\d{7}$/, // POLAND
  PT: /^[A-Z]\d{6}$/, // PORTUGAL
  RO: /^\d{8,9}$/, // ROMANIA
  SE: /^\d{8}$/, // SWEDEN
  SL: /^(P)[A-Z]\d{7}$/, // SLOVANIA
  SK: /^[0-9A-Z]\d{7}$/, // SLOVAKIA
  TR: /^[A-Z]\d{8}$/, // TURKEY
  UA: /^[A-Z]{2}\d{6}$/, // UKRAINE
  US: /^\d{9}$/, // UNITED STATES
};

/**
 * Check if str is a valid passport number
 * relative to provided ISO Country Code.
 *
 * @param {string} str
 * @param {string} countryCode
 * @return {boolean}
 */
export const isPassportNumber = (str: string, countryCode: CountryCode) => {
  assertString(str);
  /** Remove All Whitespaces, Convert to UPPERCASE */
  const normalizedStr = str.replace(/\s/g, '').toUpperCase();

  return (
    countryCode.toUpperCase() in passportRegexByCountryCode &&
    passportRegexByCountryCode[countryCode].test(normalizedStr)
  );
};
