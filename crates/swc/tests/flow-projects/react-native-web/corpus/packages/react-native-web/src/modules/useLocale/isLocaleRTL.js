/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const rtlScripts = new Set([
  'Arab',
  'Syrc',
  'Samr',
  'Mand',
  'Thaa',
  'Mend',
  'Nkoo',
  'Adlm',
  'Rohg',
  'Hebr'
]);

const rtlLangs = new Set([
  'ae', // Avestan
  'ar', // Arabic
  'arc', // Aramaic
  'bcc', // Southern Balochi
  'bqi', // Bakthiari
  'ckb', // Sorani
  'dv', // Dhivehi
  'fa',
  'far', // Persian
  'glk', // Gilaki
  'he',
  'iw', // Hebrew
  'khw', // Khowar
  'ks', // Kashmiri
  'ku', // Kurdish
  'mzn', // Mazanderani
  'nqo', // N'Ko
  'pnb', // Western Punjabi
  'ps', // Pashto
  'sd', // Sindhi
  'ug', // Uyghur
  'ur', // Urdu
  'yi' // Yiddish
]);

const cache = new Map();

/**
 * Determine the writing direction of a locale
 */
export function isLocaleRTL(locale: string): boolean {
  const cachedRTL = cache.get(locale);
  if (cachedRTL) {
    return cachedRTL;
  }

  let isRTL = false;
  // $FlowFixMe
  if (Intl.Locale) {
    try {
      // $FlowFixMe
      const script = new Intl.Locale(locale).maximize().script;
      isRTL = rtlScripts.has(script);
    } catch {
      // RangeError: Incorrect locale information provided
      // Fallback to inferring from language
      const lang = locale.split('-')[0];
      isRTL = rtlLangs.has(lang);
    }
  } else {
    // Fallback to inferring from language
    const lang = locale.split('-')[0];
    isRTL = rtlLangs.has(lang);
  }

  cache.set(locale, isRTL);
  return isRTL;
}
