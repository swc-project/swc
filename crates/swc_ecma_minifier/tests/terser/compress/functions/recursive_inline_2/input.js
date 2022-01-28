function f(n) {
    return n ? n * f(n - 1) : 1;
}
console.log(f(5));
