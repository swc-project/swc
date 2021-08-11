console.log(
    (function () {
        var o = {};
        for (var a in ((o.a = "PASS"), o)) return o[a];
    })()
);
