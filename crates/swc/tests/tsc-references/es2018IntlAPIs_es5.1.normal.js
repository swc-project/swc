// @target: es2018
// Sample from
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/supportedLocalesOf
var locales = [
    "ban",
    "id-u-co-pinyin",
    "de-ID"
];
var options = {
    localeMatcher: "lookup"
};
console.log(Intl.PluralRules.supportedLocalesOf(locales, options).join(", "));
