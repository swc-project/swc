function f(value, ...rest) {
    value = "changed";
    return ((x = (arguments = arguments[0])) => x)();
}

console.log(f("original"));
