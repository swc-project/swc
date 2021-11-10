function f() {
    const a = 1;
    return (a = 2), a;
}
console.log(f());
