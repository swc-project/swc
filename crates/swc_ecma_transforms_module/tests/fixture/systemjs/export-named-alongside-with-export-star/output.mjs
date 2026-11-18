System.register([
    "foo",
    "bar"
], function(_export, _context) {
    "use strict";
    _export({
        default: void 0,
        a: void 0,
        b: void 0
    });
    return {
        setters: [
            function(_foo_ns) {
                var exportObj = {
                    __proto__: null
                };
                for(var key in _foo_ns)if (key !== "default" && key !== "__esModule") exportObj[key] = _foo_ns[key];
                exportObj.default = _foo_ns.default;
                _export(exportObj);
            },
            function(_bar_ns) {
                var exportObj = {
                    __proto__: null
                };
                for(var key in _bar_ns)if (key !== "default" && key !== "__esModule") exportObj[key] = _bar_ns[key];
                exportObj.a = _bar_ns.a;
                exportObj.b = _bar_ns.b;
                _export(exportObj);
            }
        ],
        execute: function() {}
    };
});
