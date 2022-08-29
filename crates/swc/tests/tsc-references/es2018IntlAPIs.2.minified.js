//// [es2018IntlAPIs.ts]
console.log(Intl.PluralRules.supportedLocalesOf([
    'ban',
    'id-u-co-pinyin',
    'de-ID'
], {
    localeMatcher: 'lookup'
}).join(', '));
