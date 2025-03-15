function f() {
    return !!(f = 0);
}
console.log(f());
