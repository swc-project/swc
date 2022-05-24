import _async_generator_delegate from "@swc/helpers/lib/_async_generator_delegate.js";
import _async_iterator from "@swc/helpers/lib/_async_iterator.js";
import _await_async_generator from "@swc/helpers/lib/_await_async_generator.js";
import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
// @target: es2018
// @lib: esnext
// @filename: F1.ts
const f1 = function() {
    var _ref = _wrap_async_generator(function*() {});
    return function f1() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F2.ts
const f2 = function() {
    var _ref = _wrap_async_generator(function*() {
        const x = yield;
    });
    return function f2() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F3.ts
const f3 = function() {
    var _ref = _wrap_async_generator(function*() {
        const x = yield 1;
    });
    return function f3() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F4.ts
const f4 = function() {
    var _ref = _wrap_async_generator(function*() {
        const x = yield* _async_generator_delegate(_async_iterator([
            1
        ]), _await_async_generator);
    });
    return function f4() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F5.ts
const f5 = function() {
    var _ref = _wrap_async_generator(function*() {
        const x = yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
            yield 1;
        })()), _await_async_generator);
    });
    return function f5() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F6.ts
const f6 = function() {
    var _ref = _wrap_async_generator(function*() {
        const x = yield _await_async_generator(1);
    });
    return function f6() {
        return _ref.apply(this, arguments);
    };
}();
// @filename: F7.ts
const f7 = function() {
    var _ref = _wrap_async_generator(function*() {
        return 1;
    });
    return function f7() {
        return _ref.apply(this, arguments);
    };
}();
