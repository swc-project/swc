function run() {
    let x = 0;
    function f(a, b) {
        return a[0];
    }
    return f([
        x = 1
    ], 1);
}
console.log(run());
