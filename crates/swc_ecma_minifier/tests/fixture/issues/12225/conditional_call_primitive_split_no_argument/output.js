function run() {
    let x = true;
    function f(a, b) {
        return b;
    }
    return f("".split(), x ? 1 : 2);
}
console.log(run());
