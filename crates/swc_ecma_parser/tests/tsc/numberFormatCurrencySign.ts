// @target: esnext
// @lib: esnext
// @strict: true
const str = new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD', currencySign: 'accounting' }).format(999999);
