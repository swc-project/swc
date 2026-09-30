function f(a) {
    function g(b) {
        "use strict";
        arguments[0]++;
        return arguments[0];
    }
    console.log(g(1));
    return a;
}
console.log(f(1));
