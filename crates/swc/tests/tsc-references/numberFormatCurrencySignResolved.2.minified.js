//// [numberFormatCurrencySignResolved.ts]
const options = new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    currencySign: 'accounting'
}).resolvedOptions();
options.currencySign;
