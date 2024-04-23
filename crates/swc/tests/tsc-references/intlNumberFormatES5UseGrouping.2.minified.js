//// [intlNumberFormatES5UseGrouping.ts]
new Intl.NumberFormat('en-GB', {
    useGrouping: !0
}), new Intl.NumberFormat('en-GB', {
    useGrouping: 'true'
}), new Intl.NumberFormat('en-GB', {
    useGrouping: 'always'
}), new Intl.NumberFormat('en-GB').resolvedOptions().useGrouping;
