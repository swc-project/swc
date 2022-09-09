console.log(
    (function () {
        var o = { p: 1 };
        o.p++;
        console.log(o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 2 };
        --o.p;
        console.log(o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 3 };
        o.p += "";
        console.log(o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 4 };
        o = {};
        console.log(o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 5 };
        o.p = -9;
        console.log(o.p);
        return o.p;
    })()
);
function o() {
    this.p++;
}
console.log(
    (function () {
        var n = { p: 6 };
        o.call(n);
        console.log(n.p);
        return n.p;
    })()
);
console.log(
    (function () {
        var o = { p: 7 };
        console.log([o][0].p++);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 8 };
        console.log({ q: o }.q.p++);
        return o.p;
    })()
);
