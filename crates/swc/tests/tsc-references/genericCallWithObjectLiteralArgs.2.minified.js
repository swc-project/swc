//// [genericCallWithObjectLiteralArgs.ts]
function foo(x) {
    return x;
}
foo({
    bar: 1,
    baz: ''
}), foo({
    bar: 1,
    baz: 1
}), foo({
    bar: foo,
    baz: foo
}), foo({
    bar: 1,
    baz: ''
});
