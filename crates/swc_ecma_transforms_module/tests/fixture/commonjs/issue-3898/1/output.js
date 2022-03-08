"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.foo = void 0;
let foo = 1;
exports.foo = foo;
exports.foo = foo = 2;
exports.foo = foo += 2;
exports.foo = foo -= 2;
exports.foo = foo *= 2;
exports.foo = foo /= 2;
exports.foo = foo %= 2;
exports.foo = foo <<= 2;
exports.foo = foo >>= 2;
exports.foo = foo >>>= 2;
exports.foo = foo |= 2;
exports.foo = foo ^= 2;
exports.foo = foo &= 2;
exports.foo = foo **= 2;
exports.foo = foo &&= 2;
exports.foo = foo ||= 2;
exports.foo = foo ??= 2;
[foo] = [
    2
], exports.foo = foo;
[foo = 3] = [], exports.foo = foo;
({ bar: foo  } = {
    bar: 2
}), exports.foo = foo;
