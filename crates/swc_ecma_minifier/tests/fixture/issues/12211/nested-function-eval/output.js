function f(value) {
    return function g() {
        return eval("arguments[0]");
    };
}
console.log(f("outer")("inner"));
