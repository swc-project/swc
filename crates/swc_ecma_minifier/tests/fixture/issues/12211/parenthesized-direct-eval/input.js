function f(value, ...rest) {
    value = "changed";
    return (eval)("arguments[0]");
}

console.log(f("original"));
