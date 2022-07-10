System.register([], function (_export, _context) {
    "use strict";
    var foo, foo2, foo3, foo4, foo5, foo6, foo8;
    function foo7() {}
    _export({
        foo: void 0,
        foo2: void 0,
        foo3: void 0,
        foo4: void 0,
        foo5: void 0,
        foo6: void 0,
        foo7: foo7,
        foo8: void 0,
    });
    const binding = {
        get foo3() {
            return foo3;
        },
        set foo3(v) {
            _export("foo3", foo3 = v);
        },
    };
    return {
        setters: [],
        execute: function () {
            _export("foo", foo = 1);
            _export("foo2", foo2 = function () {});
            _export("foo4", foo4 = 2);
            _export("foo6", foo6 = 3);
            _export(
                "foo8",
                foo8 = class foo8 {
                },
            );
            binding.foo3 = 5;
        },
    };
});
