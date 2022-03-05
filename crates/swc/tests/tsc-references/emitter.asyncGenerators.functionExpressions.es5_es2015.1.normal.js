import * as swcHelpers from "@swc/helpers";
// @target: es5
// @lib: esnext
// @filename: F1.ts
const f1 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(function*() {});
    return function f1() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F2.ts
const f2 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(function*() {
        const x = yield;
    });
    return function f2() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F3.ts
const f3 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(function*() {
        const x = yield 1;
    });
    return function f3() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F4.ts
const f4 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(function*() {
        const x = yield* [
            1
        ];
    });
    return function f4() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F5.ts
const f5 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(function*() {
        const x = yield* swcHelpers.wrapAsyncGenerator(function*() {
            yield 1;
        })();
    });
    return function f5() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F6.ts
const f6 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(function*() {
        const x = yield swcHelpers.awaitAsyncGenerator(1);
    });
    return function f6() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F7.ts
const f7 = function() {
    var _ref = swcHelpers.wrapAsyncGenerator(function*() {
        return 1;
    });
    return function f7() {
        return _ref.apply(this, arguments);
    };
}();
