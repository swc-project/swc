function f(a) {
    return delete arguments[0], arguments[0];
}
console.log(f(1));
