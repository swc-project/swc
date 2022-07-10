System.register([], function (_export, _context) {
    "use strict";

    var foo, bar;
    return {
        setters: [],
        execute: function () {
            ({
                foo,
                ...bar
            } = {}), _export({ foo: foo, bar: bar });
        },
    };
});
