define([
    "require",
    "exports"
], function(require, exports) {
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
