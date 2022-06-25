(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(require("foo"), require("bar"), require("baz"));
    else if (typeof define === "function" && define.amd) define([
        "foo",
        "bar",
        "baz"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.foo, global.bar, global.baz);
})(this, function(_foo, _bar, _baz) {
    "use strict";
    _foo = _interopRequireDefault(_foo);
    _bar = _interopRequireWildcard(_bar);
    Foo = 42;
    Bar = 43;
    Baz = 44;
    ({ Foo  } = {});
    ({ Bar  } = {});
    ({ Baz  } = {});
    ({ prop: Foo  } = {});
    ({ prop: Bar  } = {});
    ({ prop: Baz  } = {});
});
