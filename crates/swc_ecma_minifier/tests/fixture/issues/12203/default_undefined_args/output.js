function f(a = void 0) {
    return a = 1, arguments[0];
}
console.log(f(2), f.length);
