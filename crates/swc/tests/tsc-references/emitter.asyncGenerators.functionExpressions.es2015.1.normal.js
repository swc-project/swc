//// [F1.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f1 = function() {
    return /*#__PURE__*/ _wrap_async_generator(function*() {})();
};
//// [F2.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f2 = function() {
    return /*#__PURE__*/ _wrap_async_generator(function*() {
        const x = yield;
    })();
};
//// [F3.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f3 = function() {
    return /*#__PURE__*/ _wrap_async_generator(function*() {
        const x = yield 1;
    })();
};
//// [F4.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f4 = function() {
    return /*#__PURE__*/ _wrap_async_generator(function*() {
        const x = yield* _async_generator_delegate(_async_iterator([
            1
        ]));
    })();
};
//// [F5.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f5 = function() {
    return /*#__PURE__*/ _wrap_async_generator(function*() {
        const x = yield* _async_generator_delegate(_async_iterator(function() {
            return /*#__PURE__*/ _wrap_async_generator(function*() {
                yield 1;
            })();
        }()));
    })();
};
//// [F6.ts]
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f6 = function() {
    return /*#__PURE__*/ _wrap_async_generator(function*() {
        const x = yield _await_async_generator(1);
    })();
};
//// [F7.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const f7 = function() {
    return /*#__PURE__*/ _wrap_async_generator(function*() {
        return 1;
    })();
};
