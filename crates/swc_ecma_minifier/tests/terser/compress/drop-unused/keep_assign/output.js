function f1() {
    var a;
    a = 1;
}
function f2() {
    var a = 1;
    a = 2;
}
function f3(a) {
    a = 1;
}
function f4() {
    var a;
    return (a = 1);
}
function f5() {
    var a;
    return function () {
        a = 1;
    };
}
