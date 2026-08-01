System.register([
    "foo"
], function(_export, _context) {
    "use strict";
    var foo, foo2;
    return {
        setters: [
            function(_foo_ns) {
                foo = _foo_ns.default;
                foo2 = _foo_ns.default;
            }
        ],
        execute: function() {}
    };
});
