(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        get: ()=>foo,
        enumerable: true
    });
    let foo = 1;
    foo = 2;
    foo += 2;
    foo -= 2;
    foo *= 2;
    foo /= 2;
    foo %= 2;
    foo <<= 2;
    foo >>= 2;
    foo >>>= 2;
    foo |= 2;
    foo ^= 2;
    foo &= 2;
    foo **= 2;
    foo &&= 2;
    foo ||= 2;
    foo ??= 2;
    [foo] = [
        2
    ];
    [foo = 3] = [];
    ({ bar: foo  } = {
        bar: 2
    });
});
