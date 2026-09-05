function run(value, common) {
    function f(a, b) {
        return b;
    }
    return f(common, "a".indexOf(value) ? 1 : 2);
}
console.log(run("a", 0));
