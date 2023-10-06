//// [localTypes4.ts]
function f1() {
    // Type parameters are in scope in parameters and return types
    function f(x) {
        return undefined;
    }
}
function f2() {
    // Local types are not in scope in parameters and return types
    function f(x) {
        return undefined;
    }
}
function f3() {
    // Type parameters and top-level local types are in same declaration space
    function f() {
        return undefined;
    }
}
function f4() {
    var v;
    v.x = 10;
    if (true) {
        var v1;
        v1.x = "hello";
    } else {
        v.x = 20;
    }
}
