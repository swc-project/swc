function f(value, ...rest) {
    return ((x = eval("arguments[0]"), arguments) => x)();
}
