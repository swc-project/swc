// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isTaxID.ts


/**
 * An Employer Identification Number (EIN), also known as a Federal Tax Identification Number,
 *  is used to identify a business entity.
 *
 * NOTES:
 *  - Prefix 47 is being reserved for future use
 *  - Prefixes 26, 27, 45, 46 and 47 were previously assigned by the Philadelphia campus.
 *
 * See `http://www.irs.gov/Businesses/Small-Businesses-&-Self-Employed/How-EINs-are-Assigned-and-Valid-EIN-Prefixes`
 * for more information.
 */

// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * Campus prefixes according to locales
 */
/**
 * @ignore
 */
const campusPrefix = {
  'en-US': {
    andover: ['10', '12'],
    atlanta: ['60', '67'],
    austin: ['50', '53'],
    brookhaven: [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '11',
      '13',
      '14',
      '16',
      '21',
      '22',
      '23',
      '25',
      '34',
      '51',
      '52',
      '54',
      '55',
      '56',
      '57',
      '58',
      '59',
      '65',
    ],
    cincinnati: ['30', '32', '35', '36', '37', '38', '61'],
    fresno: ['15', '24'],
    internet: ['20', '26', '27', '45', '46', '47'],
    kansas: ['40', '44'],
    memphis: ['94', '95'],
    ogden: ['80', '90'],
    philadelphia: [
      '33',
      '39',
      '41',
      '42',
      '43',
      '46',
      '48',
      '62',
      '63',
      '64',
      '66',
      '68',
      '71',
      '72',
      '73',
      '74',
      '75',
      '76',
      '77',
      '81',
      '82',
      '83',
      '84',
      '85',
      '86',
      '87',
      '88',
      '91',
      '92',
      '93',
      '98',
      '99',
    ],
    sba: ['31'],
  },
};

/**
 * @ignore
 */
const getPrefixes = (locale: string) => {
  const prefixes = [];

  for (const location in (campusPrefix as any)[locale]) {
    if ((campusPrefix as any)[locale].hasOwnProperty(location)) {
      prefixes.push(...(campusPrefix as any)[locale][location]);
    }
  }

  prefixes.sort();

  return prefixes;
};

// tax id regex formats for various loacles

/**
 * @ignore
 */
const taxIdFormat = {
  'en-US': /^\d{2}[- ]{0,1}\d{7}$/,
};

export const isTaxID = (str: string, locale = 'en-US') => {
  assertString(str);
  if (!(taxIdFormat as any)[locale].test(str)) {
    return false;
  }
  return getPrefixes(locale).indexOf(str.substr(0, 2)) !== -1;
};
