// @allowUnreachableCode: true
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
    let v1;
    v1.x = 10;
    if (true) {
        let v;
        v.x = "hello";
    } else {
        v1.x = 20;
    }
}
