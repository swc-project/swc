//// [es2020IntlAPIs.ts]
const date = new Date("2012-05-24");
function log(locale) {
    console.log(`${new Intl.DateTimeFormat(locale).format(date)} ${new Intl.NumberFormat(locale).format(26254.39)}`);
}
log("en-US"), log("de-DE");
const rtf1 = new Intl.RelativeTimeFormat('en', {
    style: 'narrow'
});
console.log(rtf1.format(3, 'quarter')), console.log(rtf1.format(-1, 'day')), console.log(new Intl.RelativeTimeFormat('es', {
    numeric: 'auto'
}).format(2, 'day'));
const regionNamesInEnglish = new Intl.DisplayNames([
    'en'
], {
    type: 'region'
}), regionNamesInTraditionalChinese = new Intl.DisplayNames([
    'zh-Hant'
], {
    type: 'region'
});
console.log(regionNamesInEnglish.of('US')), console.log(regionNamesInTraditionalChinese.of('US')), console.log(Intl.DisplayNames.supportedLocalesOf([
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
