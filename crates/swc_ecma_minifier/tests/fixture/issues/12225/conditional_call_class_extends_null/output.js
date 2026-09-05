function run() {
    let x = true;
    function f(a, b) {
        return b;
    }
    return f(class extends null {
    }, x ? 1 : 2);
}
console.log(run());
