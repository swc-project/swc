System.register([
    "foo",
    "foo-bar",
    "./directory/foo-bar"
], function(_export, _context) {
    "use strict";
    var foo, foo2, bar, bar2, test2;
    return {
        setters: [
            function(_foo) {
                foo = _foo.default;
                foo2 = _foo;
                bar = _foo.bar;
                bar2 = _foo.foo;
            },
            function(_foobar) {},
            function(_foobar) {}
        ],
        execute: function() {
            _export("foo", foo);
            _export("test2", test2 = 5);
            _export("default", foo);
        }
    };
});
