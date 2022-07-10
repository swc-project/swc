System.register([
    "foo",
    "bar",
], function (_export, _context) {
    "use strict";

    const export_init = {
        a: void 0,
        b: void 0,
    };
    _export(export_init);

    const _exportStar = function (from, to) {
        Object.keys(from).forEach(function (k) {
            if (
                k !== "default" &&
                !Object.prototype.hasOwnProperty.call(export_init, k)
            ) {
                to[k] = from[k];
            }
        });

        _export(to);
    };

    return {
        setters: [
            function (_foo) {
                _exportStar({ default: _foo.default });
            },
            function (_bar) {
                _exportStar({ a: _bar.a, b: _bar.b });
            },
        ],
        execute: function () {},
    };
});
