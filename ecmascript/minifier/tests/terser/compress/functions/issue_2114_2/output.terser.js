var c = 0;
(c = 1 + (c += 1)),
    (function () {
        var b = void (b && (b.b += ((c += 1), 0)));
    })();
console.log(c);
