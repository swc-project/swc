function f(a) {
    "use strict";
    const bump = () => arguments[0]++;
    bump();
    return arguments[0];
}
console.log(f(1));
