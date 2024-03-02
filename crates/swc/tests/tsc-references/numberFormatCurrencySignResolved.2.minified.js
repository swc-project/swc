//// [numberFormatCurrencySignResolved.ts]
new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    currencySign: 'accounting'
}).resolvedOptions().currencySign;
