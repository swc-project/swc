function f(a) {
    delete arguments[0];
    return arguments[0];
}
console.log(f(1));
