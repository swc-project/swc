function f() {
    return (f = 0), !!f;
}
console.log(f());
