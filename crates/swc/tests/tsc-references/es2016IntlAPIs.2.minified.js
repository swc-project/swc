//// [es2016IntlAPIs.ts]
console.log(Intl.getCanonicalLocales('EN-US')), console.log(Intl.getCanonicalLocales([
    'EN-US',
    'Fr'
]));
try {
    Intl.getCanonicalLocales('EN_US');
} catch (err) {
    console.log(err.toString());
}
