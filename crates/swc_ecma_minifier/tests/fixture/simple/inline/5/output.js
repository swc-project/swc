export function foo() {
    console.log(2), console.log(1);
    for(var c = 0; c < 10; c++)console.log(c);
}
export function bar() {
    function x() {
        b = 1;
    }
    for(var b = 10, c = 0; c < 10; c++)/*#__NOINLINE__*/ x(), console.log(b, c);
}
