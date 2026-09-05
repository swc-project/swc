function run(value, common) {
    function f(a, b) {
        return b;
    }

    return "a".indexOf(value) ? f(common, 1) : f(common, 2);
}

console.log(run("a", 0));
