function foo(val) {
    function bar(x) {
        if (x) return x;
        bar(x - 1);
    }
    return bar(val);
}
console.log(foo("PASS"));
