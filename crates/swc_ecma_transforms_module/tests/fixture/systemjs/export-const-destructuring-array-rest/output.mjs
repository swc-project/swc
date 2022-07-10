System.register([], function (_export, _context) {
    "use strict";

    var foo, bar, baz;
    return {
        setters: [],
        execute: function () {
            [foo, bar, ...baz] = [], _export({ foo: foo, bar: bar, baz: baz });
        },
    };
});
