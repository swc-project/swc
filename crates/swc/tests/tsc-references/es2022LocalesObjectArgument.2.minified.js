//// [es2022LocalesObjectArgument.ts]
const enUS = new Intl.Locale("en-US"), deDE = new Intl.Locale("de-DE"), jaJP = new Intl.Locale("ja-JP");
new Intl.Segmenter(enUS), new Intl.Segmenter([
    deDE,
    jaJP
]), Intl.Segmenter.supportedLocalesOf(enUS), Intl.Segmenter.supportedLocalesOf([
    deDE,
    jaJP
]);
