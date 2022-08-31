function foo(x) {
    bar(x);
}
function bar(x) {
    if (x === 1) {
        throw new Error();
    }
}
foo(3);
foo(2);
foo(1);
