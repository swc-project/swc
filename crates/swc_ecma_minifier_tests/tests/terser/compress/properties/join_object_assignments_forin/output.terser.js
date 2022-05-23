console.log(
    (function () {
        var o = { a: "PASS" };
        for (var a in o) return o[a];
    })()
);
