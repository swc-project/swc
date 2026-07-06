System.register([
    "foo"
], function(_export, _context) {
    "use strict";
    _export({
        bar: void 0,
        default: void 0
    });
    return {
        setters: [
            function(_foo_ns) {
                _export({
                    bar: _foo_ns.bar,
                    default: _foo_ns.foo
                });
            }
        ],
        execute: function() {}
    };
});
