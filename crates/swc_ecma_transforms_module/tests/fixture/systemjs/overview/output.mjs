System.register([
    "foo",
    "foo-bar",
    "./directory/foo-bar"
], function(_export, _context) {
    "use strict";
    var bar, bar2, foo, foo2, test2;
    _export({
        default: void 0,
        foo: void 0,
        test2: void 0
    });
    return {
        setters: [
            function(_foo_ns) {
                foo = _foo_ns.default;
                _export("foo", foo);
                foo2 = _foo_ns;
                bar = _foo_ns.bar;
                bar2 = _foo_ns.foo;
            },
            function() {},
            function() {}
        ],
        execute: function() {
            _export("test2", test2 = 5);
            _export("default", foo);
        }
    };
});
