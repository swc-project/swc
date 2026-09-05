function run() {
    let x = true;
    function side() {
        x = false;
        return 0;
    }
    function f(a, b) {
        return b;
    }
    return x ? f(side(), 1) : f(side(), 2);
}
console.log(run());
