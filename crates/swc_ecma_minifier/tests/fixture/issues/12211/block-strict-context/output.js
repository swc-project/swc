{
    "custom";
    "use strict";
    let marker = globalThis.marker;
    console.log(marker);
    function f(value, ...rest) {
        value = "changed";
        return arguments[0];
    }
    console.log(f("original"));
}
