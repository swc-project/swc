//// [intlNumberFormatES2023.ts]
const { roundingPriority, roundingMode, roundingIncrement, trailingZeroDisplay, useGrouping } = new Intl.NumberFormat('en-GB').resolvedOptions();
new Intl.NumberFormat('en-GB', {}), new Intl.NumberFormat('en-GB', {
    roundingPriority: 'lessPrecision',
    roundingIncrement: 100,
    roundingMode: 'trunc'
});
const { signDisplay } = new Intl.NumberFormat('en-GB', {
    signDisplay: 'negative'
}).resolvedOptions();
new Intl.NumberFormat('en-GB', {
    useGrouping: !0
}), new Intl.NumberFormat('en-GB', {
    useGrouping: 'true'
}), new Intl.NumberFormat('en-GB', {
    useGrouping: 'always'
}), new Intl.NumberFormat('en-GB').formatRange(10, 100), new Intl.NumberFormat('en-GB').formatRange(10n, 1000n), new Intl.NumberFormat('en-GB').formatRangeToParts(10, 1000)[0], new Intl.NumberFormat('en-GB').formatRangeToParts(10n, 1000n)[0], new Intl.NumberFormat('en-GB').format('-12.3E-4'), new Intl.NumberFormat('en-GB').formatRange('123.4', '567.8'), new Intl.NumberFormat('en-GB').formatRangeToParts('123E-4', '567E8'), new Intl.NumberFormat('en-GB').format('Infinity'), new Intl.NumberFormat('en-GB').format('-Infinity'), new Intl.NumberFormat('en-GB').format('+Infinity');
