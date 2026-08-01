System.register([
    "foo"
], function(_export, _context) {
    "use strict";
    var bar, bar2, baz, baz2, baz3, xyz;
    return {
        setters: [
            function(_foo_ns) {
                bar = _foo_ns.bar;
                bar2 = _foo_ns.bar2;
                baz = _foo_ns.baz;
                baz2 = _foo_ns.bar;
                baz3 = _foo_ns.bar;
                xyz = _foo_ns.xyz;
            }
        ],
        execute: function() {}
    };
});
