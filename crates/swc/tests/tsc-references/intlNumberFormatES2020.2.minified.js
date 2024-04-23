//// [intlNumberFormatES2020.ts]
const { notation, style, signDisplay } = new Intl.NumberFormat('en-NZ').resolvedOptions();
new Intl.NumberFormat('en-NZ', {}), new Intl.NumberFormat('en-NZ', {
    numberingSystem: 'arab'
});
const { currency, currencySign } = new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    currencySign: 'accounting'
}).resolvedOptions(), { unit, unitDisplay } = new Intl.NumberFormat('en-NZ', {
    style: 'unit',
    unit: 'kilogram',
    unitDisplay: 'narrow'
}).resolvedOptions(), { compactDisplay } = new Intl.NumberFormat('en-NZ', {
    notation: 'compact',
    compactDisplay: 'long'
}).resolvedOptions();
new Intl.NumberFormat('en-NZ', {
    signDisplay: 'always'
});
