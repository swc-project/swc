//// [typeGuardNarrowsPrimitiveIntersection.ts]
var value;
if (isNonBlank(value)) {
    doThis(value);
} else {
    doThat(value);
}
var Tag2;
if (isNonBlank2(value)) {
    doThis2(value);
} else {
    doThat2(value);
}
