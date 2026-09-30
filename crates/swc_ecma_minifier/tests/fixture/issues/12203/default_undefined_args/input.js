function f(a = undefined) {
    a = 1;
    return arguments[0];
}
console.log(f(2), f.length);
