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
        var o;
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
function inc() {
    this.p++;
}
console.log(
    (function () {
        var o = { p: 6 };
        inc.call(o);
        console.log(o.p);
        return o.p;
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
