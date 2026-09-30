function f(a) {
    "use strict";
    delete arguments[0];
    return a;
}
console.log(f(1));
