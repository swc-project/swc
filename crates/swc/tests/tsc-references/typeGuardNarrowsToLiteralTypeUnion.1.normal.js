//// [typeGuardNarrowsToLiteralTypeUnion.ts]
var value;
if (isFoo(value)) {
    doThis(value);
} else {
    doThat(value);
}
