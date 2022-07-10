System.register([
    "foo",
], function (_export, _context) {
    "use strict";

    const _exportStar = function (from, to) {
        Object.keys(from).forEach(function (k) {
            if (k !== "default") {
                to[k] = from[k];
            }
        });

        _export(to);
    };

    return {
        setters: [
            function (_foo) {
                _exportStar({});
            },
        ],
        execute: function () {},
    };
});
