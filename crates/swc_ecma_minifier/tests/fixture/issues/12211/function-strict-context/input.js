function f(value, ...rest) {
    "use strict";
    value = "changed";
    return arguments[0];
}

console.log(f("original"));
