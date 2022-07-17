// @strict: true
if (value.foo !== null) {
    value.foo.toExponential();
    value.other // should still be number | null
    ;
    value.bar // should still be number | null
    ;
}
