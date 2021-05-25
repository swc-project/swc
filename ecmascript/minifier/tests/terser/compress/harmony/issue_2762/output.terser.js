var bar = 1,
    T = true;
(function () {
    if (T) {
        const o = function () {
            var p = bar;
            console.log(p, o.prop, r.prop);
        };
        o.prop = 2;
        const r = { prop: 3 };
        o();
    }
})();
