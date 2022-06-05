define(["require", "exports"], function (require, _exports) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true,
    });
    __export(_exports, {
        foo: function () {
            return foo;
        },
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
    [foo] = [2];
    [foo = 3] = [];
    ({ bar: foo } = {
        bar: 2,
    });
});
