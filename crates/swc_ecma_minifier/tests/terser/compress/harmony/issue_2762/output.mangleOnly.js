var o = 1, p = true;
(function() {
    if (p) {
        const r = function() {
            var p = o;
            console.log(p, r.prop, n.prop);
        };
        r.prop = 2;
        const n = {
            prop: 3
        };
        r();
    }
})();
