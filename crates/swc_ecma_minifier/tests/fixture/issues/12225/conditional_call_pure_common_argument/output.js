function run() {
    let x = true;
    function f(a, b) {
        return b;
    }
    return f(0, x ? 1 : 2);
}
console.log(run());
