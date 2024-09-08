//// [F1.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f1 = /*#__PURE__*/ function() {
    var _ref = _wrap_async_generator(function*() {});
    return function f1() {
        return _ref.apply(this, arguments);
    };
}();
//// [F2.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f2 = /*#__PURE__*/ function() {
    var _ref = _wrap_async_generator(function*() {
        const x = yield;
    });
    return function f2() {
        return _ref.apply(this, arguments);
    };
}();
//// [F3.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f3 = /*#__PURE__*/ function() {
    var _ref = _wrap_async_generator(function*() {
        const x = yield 1;
    });
    return function f3() {
        return _ref.apply(this, arguments);
    };
}();
//// [F4.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f4 = /*#__PURE__*/ function() {
    var _ref = _wrap_async_generator(function*() {
        const x = yield* _async_generator_delegate(_async_iterator([
            1
        ]), _await_async_generator);
    });
    return function f4() {
        return _ref.apply(this, arguments);
    };
}();
//// [F5.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f5 = /*#__PURE__*/ function() {
    var _ref = _wrap_async_generator(function*() {
        const x = yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
            yield 1;
        })()), _await_async_generator);
    });
    return function f5() {
        return _ref.apply(this, arguments);
    };
}();
//// [F6.ts]
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f6 = /*#__PURE__*/ function() {
    var _ref = _wrap_async_generator(function*() {
        const x = yield _await_async_generator(1);
    });
    return function f6() {
        return _ref.apply(this, arguments);
    };
}();
//// [F7.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f7 = /*#__PURE__*/ function() {
    var _ref = _wrap_async_generator(function*() {
        return 1;
    });
    return function f7() {
        return _ref.apply(this, arguments);
    };
}();
