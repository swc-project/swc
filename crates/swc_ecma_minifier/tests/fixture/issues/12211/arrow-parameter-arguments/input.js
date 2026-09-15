function f(value, ...rest) {
    value = "changed";
    return ((x = arguments[0]) => x)();
}

console.log(f("original"));
