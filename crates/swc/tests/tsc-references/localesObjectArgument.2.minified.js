//// [localesObjectArgument.ts]
const enUS = new Intl.Locale("en-US"), deDE = new Intl.Locale("de-DE"), jaJP = new Intl.Locale("ja-JP"), now = new Date(), readonlyLocales = [
    'de-DE',
    'ja-JP'
];
now.toLocaleString(enUS), now.toLocaleDateString(enUS), now.toLocaleTimeString(enUS), now.toLocaleString([
    deDE,
    jaJP
]), now.toLocaleDateString([
    deDE,
    jaJP
]), now.toLocaleTimeString([
    deDE,
    jaJP
]), 1000..toLocaleString(enUS), 1000..toLocaleString([
    deDE,
    jaJP
]), 123456789123456789n.toLocaleString(enUS), 123456789123456789n.toLocaleString([
    deDE,
    jaJP
]), new Intl.PluralRules(enUS), new Intl.PluralRules([
    deDE,
    jaJP
]), new Intl.PluralRules(readonlyLocales), Intl.PluralRules.supportedLocalesOf(enUS), Intl.PluralRules.supportedLocalesOf([
    deDE,
    jaJP
]), Intl.PluralRules.supportedLocalesOf(readonlyLocales), new Intl.RelativeTimeFormat(enUS), new Intl.RelativeTimeFormat([
    deDE,
    jaJP
]), new Intl.RelativeTimeFormat(readonlyLocales), Intl.RelativeTimeFormat.supportedLocalesOf(enUS), Intl.RelativeTimeFormat.supportedLocalesOf([
    deDE,
    jaJP
]), Intl.RelativeTimeFormat.supportedLocalesOf(readonlyLocales), new Intl.Collator(enUS), new Intl.Collator([
    deDE,
    jaJP
]), new Intl.Collator(readonlyLocales), Intl.Collator.supportedLocalesOf(enUS), Intl.Collator.supportedLocalesOf([
    deDE,
    jaJP
]), new Intl.DateTimeFormat(enUS), new Intl.DateTimeFormat([
    deDE,
    jaJP
]), new Intl.DateTimeFormat(readonlyLocales), Intl.DateTimeFormat.supportedLocalesOf(enUS), Intl.DateTimeFormat.supportedLocalesOf([
    deDE,
    jaJP
]), Intl.DateTimeFormat.supportedLocalesOf(readonlyLocales), new Intl.NumberFormat(enUS), new Intl.NumberFormat([
    deDE,
    jaJP
]), new Intl.NumberFormat(readonlyLocales), Intl.NumberFormat.supportedLocalesOf(enUS), Intl.NumberFormat.supportedLocalesOf(readonlyLocales);
