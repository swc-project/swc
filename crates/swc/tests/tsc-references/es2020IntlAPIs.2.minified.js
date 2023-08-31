//// [es2020IntlAPIs.ts]
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
const date = new Date("2012-05-24");
function log(locale) {
    console.log(`${new Intl.DateTimeFormat(locale).format(date)} ${new Intl.NumberFormat(locale).format(26254.39)}`);
}
log("en-US"), // expected output: 5/24/2012 26,254.39
log("de-DE");
// expected output: 24.5.2012 26.254,39
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
const rtf1 = new Intl.RelativeTimeFormat('en', {
    style: 'narrow'
});
console.log(rtf1.format(3, 'quarter')), //expected output: "in 3 qtrs."
console.log(rtf1.format(-1, 'day'));
//expected output: "1 day ago"
const rtf2 = new Intl.RelativeTimeFormat('es', {
    numeric: 'auto'
});
console.log(rtf2.format(2, 'day'));
//expected output: "pasado mañana"
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames
const regionNamesInEnglish = new Intl.DisplayNames([
    'en'
], {
    type: 'region'
}), regionNamesInTraditionalChinese = new Intl.DisplayNames([
    'zh-Hant'
], {
    type: 'region'
});
console.log(regionNamesInEnglish.of('US')), // expected output: "United States"
console.log(regionNamesInTraditionalChinese.of('US')), console.log(Intl.DisplayNames.supportedLocalesOf([
    'ban',
    'id-u-co-pinyin',
    'de-ID'
], {
    localeMatcher: 'lookup'
}).join(', ')), new Intl.Locale(), new Intl.Locale(new Intl.Locale('en-US')), new Intl.DisplayNames(), new Intl.DisplayNames('en'), new Intl.DisplayNames('en', {}), console.log(new Intl.DisplayNames(void 0, {
    type: 'language'
}).of('en-GB'));
const localesArg = [
    "es-ES",
    new Intl.Locale("en-US")
];
console.log(new Intl.DisplayNames(localesArg, {
    type: 'language'
}).resolvedOptions().locale), console.log(Intl.DisplayNames.supportedLocalesOf(localesArg)), console.log(Intl.DisplayNames.supportedLocalesOf()), console.log(Intl.DisplayNames.supportedLocalesOf(localesArg, {}));
 // ["es-ES", "en-US"]
