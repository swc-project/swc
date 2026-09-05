function run() {
    let x = true;
    Object.defineProperty(Function.prototype, "watched", {
        get () {
            x = false;
            return 0;
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f((function() {}).watched, 1) : f((function() {}).watched, 2);
}
console.log(run());
