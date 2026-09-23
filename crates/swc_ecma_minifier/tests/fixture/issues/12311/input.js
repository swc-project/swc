function f() {
    let a = foo();
    return [
        class {
            static x = bar();
        },
        a,
    ];
}
function foo() {
    console.log("foo");
    return 1;
}
function bar() {
    console.log("bar");
}
f();
