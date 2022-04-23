console.log(
    (function bar(x) {
        if (x) return x;
        bar(x - 1);
    })("PASS")
);
