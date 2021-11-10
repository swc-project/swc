function log(x) {
    console.log(x);
}
function foo() {
    return log;
}
function bar() {
    if (x !== (x = foo())) {
        x(1);
    } else {
        x(2);
    }
}
var x = function () {
    console.log("init");
};
bar();
bar();
