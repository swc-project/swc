function f(value, ...rest) {
    return ((arguments) => eval("arguments[0]"))(["shadowed"]);
}

console.log(f("outer"));
