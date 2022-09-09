console.log(
    (function (o) {
        do {
            var c = { c: o++ };
        } while (c.c && o);
        return o;
    })(0)
);
