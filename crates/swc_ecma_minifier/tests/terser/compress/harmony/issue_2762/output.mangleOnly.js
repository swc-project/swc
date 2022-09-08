var o = 1, p = true;
(function() {
    if (p) {
        const n = function() {
            var p = o;
            console.log(p, n.prop, r.prop);
        };
        n.prop = 2;
        const r = {
            prop: 3
        };
        n();
    }
})();
