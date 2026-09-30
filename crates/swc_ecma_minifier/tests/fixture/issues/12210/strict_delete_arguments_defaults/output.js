function f(a) {
    return delete arguments[0], a;
}
console.log(f(1));
