// @target: esnext
// @lib: esnext
// @strict: true
var options = new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    currencySign: "accounting"
}).resolvedOptions();
var currencySign = options.currencySign;
