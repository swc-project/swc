function foo(a) {
    const VALUE = 1;
    console.log(2 | VALUE);
    console.log(VALUE + 1);
    console.log(VALUE);
    console.log(a & VALUE);
}
function bar() {
    const s = "01234567890123456789";
    console.log(s + s + s + s + s);
    const CONSTANT = "abc";
    console.log(CONSTANT + CONSTANT + CONSTANT + CONSTANT + CONSTANT);
}
