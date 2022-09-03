//// [genericCallWithObjectLiteralArgs.ts]
function foo(x) {
    return x;
}
var r = foo({
    bar: 1,
    baz: ""
}), r2 = foo({
    bar: 1,
    baz: 1
}), r3 = foo({
    bar: foo,
    baz: foo
}), r4 = foo({
    bar: 1,
    baz: ""
});
