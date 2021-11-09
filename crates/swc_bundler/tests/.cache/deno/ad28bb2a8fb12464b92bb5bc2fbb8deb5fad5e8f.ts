// Loaded from https://deno.land/x/segno@v1.1.0/lib/helpers/alpha.ts


export const alpha = {
  'en-US': /^[A-Z]+$/i,
  'bg-BG': /^[А-Я]+$/i,
  'cs-CZ': /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  'da-DK': /^[A-ZÆØÅ]+$/i,
  'de-DE': /^[A-ZÄÖÜß]+$/i,
  'el-GR': /^[Α-ώ]+$/i,
  'es-ES': /^[A-ZÁÉÍÑÓÚÜ]+$/i,
  'fr-FR': /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'it-IT': /^[A-ZÀÉÈÌÎÓÒÙ]+$/i,
  'nb-NO': /^[A-ZÆØÅ]+$/i,
  'nl-NL': /^[A-ZÁÉËÏÓÖÜÚ]+$/i,
  'nn-NO': /^[A-ZÆØÅ]+$/i,
  'hu-HU': /^[A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  'pl-PL': /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
  'ru-RU': /^[А-ЯЁ]+$/i,
  'sl-SI': /^[A-ZČĆĐŠŽ]+$/i,
  'sk-SK': /^[A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  'sr-RS@latin': /^[A-ZČĆŽŠĐ]+$/i,
  'sr-RS': /^[А-ЯЂЈЉЊЋЏ]+$/i,
  'sv-SE': /^[A-ZÅÄÖ]+$/i,
  'tr-TR': /^[A-ZÇĞİıÖŞÜ]+$/i,
  'uk-UA': /^[А-ЩЬЮЯЄIЇҐі]+$/i,
  'vi-VN': /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
  'ku-IQ': /^[ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
  he: /^[א-ת]+$/,
  fa: /^['آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی']+$/i,
};

export const alphanumeric = {
  'en-US': /^[0-9A-Z]+$/i,
  'bg-BG': /^[0-9А-Я]+$/i,
  'cs-CZ': /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  'da-DK': /^[0-9A-ZÆØÅ]+$/i,
  'de-DE': /^[0-9A-ZÄÖÜß]+$/i,
  'el-GR': /^[0-9Α-ω]+$/i,
  'es-ES': /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
  'fr-FR': /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'it-IT': /^[0-9A-ZÀÉÈÌÎÓÒÙ]+$/i,
  'hu-HU': /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  'nb-NO': /^[0-9A-ZÆØÅ]+$/i,
  'nl-NL': /^[0-9A-ZÁÉËÏÓÖÜÚ]+$/i,
  'nn-NO': /^[0-9A-ZÆØÅ]+$/i,
  'pl-PL': /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[0-9A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
  'ru-RU': /^[0-9А-ЯЁ]+$/i,
  'sl-SI': /^[0-9A-ZČĆĐŠŽ]+$/i,
  'sk-SK': /^[0-9A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  'sr-RS@latin': /^[0-9A-ZČĆŽŠĐ]+$/i,
  'sr-RS': /^[0-9А-ЯЂЈЉЊЋЏ]+$/i,
  'sv-SE': /^[0-9A-ZÅÄÖ]+$/i,
  'tr-TR': /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
  'uk-UA': /^[0-9А-ЩЬЮЯЄIЇҐі]+$/i,
  'ku-IQ': /^[٠١٢٣٤٥٦٧٨٩0-9ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  'vi-VN': /^[0-9A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
  he: /^[0-9א-ת]+$/,
  fa: /^['0-9آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی۱۲۳۴۵۶۷۸۹۰']+$/i,
};

export const decimal = {
  'en-US': '.',
  ar: '٫',
  fa: '٫',
};

export const englishLocales = ['AU', 'GB', 'HK', 'IN', 'NZ', 'ZA', 'ZM'];

for (let locale, i = 0; i < englishLocales.length; i++) {
  locale = `en-${englishLocales[i]}`;

  (alpha as any)[locale] = alpha['en-US'];
  (alphanumeric as any)[locale] = alphanumeric['en-US'];
  (decimal as any)[locale] = decimal['en-US'];
}

// Source: http://www.localeplanet.com/java/
export const arabicLocales = [
  'AE',
  'BH',
  'DZ',
  'EG',
  'IQ',
  'JO',
  'KW',
  'LB',
  'LY',
  'MA',
  'QM',
  'QA',
  'SA',
  'SD',
  'SY',
  'TN',
  'YE',
];

for (let locale, i = 0; i < arabicLocales.length; i++) {
  locale = `ar-${arabicLocales[i]}`;
  (alpha as any)[locale] = alpha.ar;
  (alphanumeric as any)[locale] = alphanumeric.ar;
  (decimal as any)[locale] = decimal.ar;
}

export const farsiLocales = ['IR', 'AF'];

for (let locale, i = 0; i < farsiLocales.length; i++) {
  locale = `fa-${farsiLocales[i]}`;
  (alpha as any)[locale] = alpha.fa;
  (alphanumeric as any)[locale] = alphanumeric.fa;
  (decimal as any)[locale] = decimal.fa;
}

// Source: https://en.wikipedia.org/wiki/Decimal_mark
export const dotDecimal = ['ar-EG', 'ar-LB', 'ar-LY'];
export const commaDecimal = [
  'bg-BG',
  'cs-CZ',
  'da-DK',
  'de-DE',
  'el-GR',
  'en-ZM',
  'es-ES',
  'fr-FR',
  'it-IT',
  'ku-IQ',
  'hu-HU',
  'nb-NO',
  'nn-NO',
  'nl-NL',
  'pl-PL',
  'pt-PT',
  'ru-RU',
  'sl-SI',
  'sr-RS@latin',
  'sr-RS',
  'sv-SE',
  'tr-TR',
  'uk-UA',
  'vi-VN',
];

for (let i = 0; i < dotDecimal.length; i++) {
  (decimal as any)[dotDecimal[i]] = decimal['en-US'];
}

for (let i = 0; i < commaDecimal.length; i++) {
  (decimal as any)[commaDecimal[i]] = ',';
}

(alpha as any)['pt-BR'] = alpha['pt-PT'];
(alphanumeric as any)['pt-BR'] = alphanumeric['pt-PT'];
(decimal as any)['pt-BR'] = (decimal as any)['pt-PT'];

// see validatorjs/validator.js/#862
(alpha as any)['pl-Pl'] = alpha['pl-PL'];
(alphanumeric as any)['pl-Pl'] = alphanumeric['pl-PL'];
(decimal as any)['pl-Pl'] = (decimal as any)['pl-PL'];
