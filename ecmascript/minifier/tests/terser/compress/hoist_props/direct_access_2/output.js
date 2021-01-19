var o = { a: 1 };
console.log(
    (function (k) {
        if (o[k]) return "PASS";
    })("a")
);
