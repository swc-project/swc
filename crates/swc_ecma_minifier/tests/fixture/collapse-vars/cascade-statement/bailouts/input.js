function barrier() {
    var c = 0;
    function read() {
        console.log("before", c);
        return 1;
    }
    return (c = 2), read() + c;
}
console.log("barrier", barrier());

function shortCircuit(flag) {
    var c;
    (c = 3), flag && c;
    console.log("short", c);
}
shortCircuit(false);

function protectedBinding() {
    const c = 0;
    try {
        return (c = 1), c || 2;
    } catch (error) {
        console.log("const", error instanceof TypeError, c);
    }
}
protectedBinding();

function directEval() {
    var c = 0;
    (c = 4), eval("console.log('eval', c)");
}
directEval();

function protectedCall(fn) {
    var c;
    (c = fn), /*#__NOINLINE__*/ c();
}
protectedCall(function () {
    console.log("protected call");
});

function argumentsValue() {
    var c;
    return (c = arguments), c[0];
}
console.log("arguments", argumentsValue(5));
