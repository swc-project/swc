// @target: es2020
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#Locale_identification_and_negotiation
var count = 26254.39;
var date = new Date("2012-05-24");
function log(locale) {
    console.log("".concat(new Intl.DateTimeFormat(locale).format(date), " ").concat(new Intl.NumberFormat(locale).format(count)));
}
log("en-US");
// expected output: 5/24/2012 26,254.39
log("de-DE");
// expected output: 24.5.2012 26.254,39
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat
var rtf1 = new Intl.RelativeTimeFormat("en", {
    style: "narrow"
});
console.log(rtf1.format(3, "quarter"));
//expected output: "in 3 qtrs."
console.log(rtf1.format(-1, "day"));
//expected output: "1 day ago"
var rtf2 = new Intl.RelativeTimeFormat("es", {
    numeric: "auto"
});
console.log(rtf2.format(2, "day"));
//expected output: "pasado mañana"
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames
var regionNamesInEnglish = new Intl.DisplayNames([
    "en"
], {
    type: "region"
});
var regionNamesInTraditionalChinese = new Intl.DisplayNames([
    "zh-Hant"
], {
    type: "region"
});
console.log(regionNamesInEnglish.of("US"));
// expected output: "United States"
console.log(regionNamesInTraditionalChinese.of("US"));
// expected output: "美國"
var locales1 = [
    "ban",
    "id-u-co-pinyin",
    "de-ID"
];
var options1 = {
    localeMatcher: "lookup"
};
console.log(Intl.DisplayNames.supportedLocalesOf(locales1, options1).join(", "));
