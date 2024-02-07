//// [es2021LocalesObjectArgument.ts]
const enUS = new Intl.Locale("en-US"), deDE = new Intl.Locale("de-DE"), jaJP = new Intl.Locale("ja-JP");
new Intl.ListFormat(enUS), new Intl.ListFormat([
    deDE,
    jaJP
]), Intl.ListFormat.supportedLocalesOf(enUS), Intl.ListFormat.supportedLocalesOf([
    deDE,
    jaJP
]);
