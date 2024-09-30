//// [typeGuardNarrowsPrimitiveIntersection.ts]
var value;
if (isNonBlank(value)) {
    doThis(value);
} else {
    doThat(value);
}
;
if (isNonBlank2(value)) {
    doThis2(value);
} else {
    doThat2(value);
}
