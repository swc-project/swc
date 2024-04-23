//// [es2018IntlAPIs.ts]
console.log(Intl.PluralRules.supportedLocalesOf([
    'ban',
    'id-u-co-pinyin',
    'de-ID'
], {
    localeMatcher: 'lookup'
}).join(', '));
const [part] = new Intl.NumberFormat().formatToParts();
console.log(part.type, part.value);
