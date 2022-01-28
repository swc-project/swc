var bar = 1,
    T = true;
(function () {
    if (T) {
        const a = function () {
            var foo = bar;
            console.log(foo, a.prop, b.prop);
        };
        a.prop = 2;
        const b = { prop: 3 };
        a();
    }
})();
