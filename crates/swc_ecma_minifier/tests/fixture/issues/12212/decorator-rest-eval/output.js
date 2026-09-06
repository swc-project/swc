function dec(value) {
    return value;
}
function f(...rest) {
    return class {
        @dec(eval("rest.length"))
        method(
        @dec(eval("rest.length"))
        value) {}
    };
}
f(1);
