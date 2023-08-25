//// [es2018IntlAPIs.ts]
// Sample from
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/supportedLocalesOf
console.log(Intl.PluralRules.supportedLocalesOf([
    'ban',
    'id-u-co-pinyin',
    'de-ID'
], {
    localeMatcher: 'lookup'
}).join(', '));
