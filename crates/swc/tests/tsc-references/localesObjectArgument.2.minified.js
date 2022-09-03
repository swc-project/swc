//// [localesObjectArgument.ts]
const enUS = new Intl.Locale("en-US"), deDE = new Intl.Locale("de-DE"), jaJP = new Intl.Locale("ja-JP"), now = new Date(), num = 1000, bigint = 123456789123456789n;
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
]);
