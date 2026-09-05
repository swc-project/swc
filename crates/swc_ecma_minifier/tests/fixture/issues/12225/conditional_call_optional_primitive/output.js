function run() {
    let x = true;
    function f(a, b) {
        return b;
    }
    return f("".trim?.(), x ? 1 : 2);
}
console.log(run());
