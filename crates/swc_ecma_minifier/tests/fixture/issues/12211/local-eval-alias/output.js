function f(value, eval, ...rest) {
    value = "changed";
    return eval("arguments[0]");
}
console.log(f("original", globalThis.eval));
