//// [es2018IntlAPIs.ts]
const locales = [
    'ban',
    'id-u-co-pinyin',
    'de-ID'
], options = {
    localeMatcher: 'lookup'
};
console.log(Intl.PluralRules.supportedLocalesOf(locales, options).join(', '));
