System.register([
    "foo"
], function(_export, _context) {
    "use strict";
    _export({
        bar: void 0,
        foo: void 0
    });
    return {
        setters: [
            function(_foo_ns) {
                _export({
                    bar: _foo_ns.bar,
                    foo: _foo_ns.foo
                });
            }
        ],
        execute: function() {}
    };
});
