function f(value, ...rest) {
    return function g() {
        return eval("arguments[0]");
    };
}

console.log(f("outer")("inner"));
