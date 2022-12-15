(function () {
    var Collector = function () {
        var e = function e(e) { };
        return e.usePlugin = function (t, i, n) {
            if (i) {
                for (var o = !1, s = 0, r = e.plugins.length; s < r; s++);
                o || e.plugins.push({
                    name: i,
                    plugin: t,
                    options: n
                });
            } else e.plugins.push({
                plugin: t
            });
        }, e.plugins = [], e;
    }();
    var CallbackType;
    !function (e) {
        e[e.Var = 0] = "Var", e[e.All = 1] = "All";
    }(CallbackType || (CallbackType = {}));
    var CepRule = function () {
        eval();
    }();
    Collector.usePlugin(CepRule, "cep");

    exports.Collector = Collector;
})()