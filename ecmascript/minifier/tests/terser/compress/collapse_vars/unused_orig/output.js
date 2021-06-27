var a = 1;
console.log(
    (function (b) {
        var c = b;
        for (var d in c) {
            var a;
            return --b + c[0];
        }
        a && a.NaN;
    })([2]),
    a
);
