//// [intlNumberFormatES5UseGrouping.ts]
new Intl.NumberFormat('en-GB', {
    useGrouping: true
});
new Intl.NumberFormat('en-GB', {
    useGrouping: 'true'
}); // expect error
new Intl.NumberFormat('en-GB', {
    useGrouping: 'always'
}); // expect error
var useGrouping = new Intl.NumberFormat('en-GB').resolvedOptions().useGrouping;
