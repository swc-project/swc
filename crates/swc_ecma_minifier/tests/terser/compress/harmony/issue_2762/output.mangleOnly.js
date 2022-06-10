var a = 1, b = true;
(function() {
    if (b) {
        const c = function() {
            var b = a;
            console.log(b, c.prop, d.prop);
        };
        c.prop = 2;
        const d = {
            prop: 3
        };
        c();
    }
})();
