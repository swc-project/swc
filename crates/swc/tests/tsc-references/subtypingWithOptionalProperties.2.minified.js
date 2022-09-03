//// [subtypingWithOptionalProperties.ts]
function f(a) {
    return a;
}
var r = f({
    s: {}
});
r.s && r.s.toFixed();
