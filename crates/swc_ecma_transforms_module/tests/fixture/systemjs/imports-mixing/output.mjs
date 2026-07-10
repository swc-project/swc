System.register([
    "foo"
], function(_export, _context) {
    "use strict";
    var foo, xyz;
    return {
        setters: [
            function(_foo_ns) {
                foo = _foo_ns.default;
                xyz = _foo_ns.baz;
            }
        ],
        execute: function() {}
    };
});
