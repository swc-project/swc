function f(x) {
    var g = () => C;
    if (x) return;
    class C {}
    return g();
}

function letTail(x) {
    var g = () => C;
    if (x) return;
    let C = () => {};
    return g();
}

function constTail(x) {
    var g = () => C;
    if (x) return;
    const C = () => {};
    return g();
}

function functionTail(x) {
    var g = () => C;
    if (x) return;
    function C() {}
    return g();
}

function varTail(x) {
    var g = () => C;
    if (x) return;
    var C = () => {};
    return g();
}

console.log(
    typeof f(false),
    f(true),
    typeof letTail(false),
    letTail(true),
    typeof constTail(false),
    constTail(true),
    typeof functionTail(false),
    functionTail(true),
    typeof varTail(false),
    varTail(true),
);
