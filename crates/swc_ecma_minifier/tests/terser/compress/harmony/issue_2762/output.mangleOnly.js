var o = 1,
    p = true;
(function () {
    if (p) {
        const p = function () {
            var r = o;
            console.log(r, p.prop, n.prop);
        };
        p.prop = 2;
        const n = { prop: 3 };
        p();
    }
})();
