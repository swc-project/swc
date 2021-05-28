function f() {
    const a = 1;
    return a++, a;
}
console.log(f());
