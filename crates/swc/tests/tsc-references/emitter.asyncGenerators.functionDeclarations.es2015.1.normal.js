//// [F1.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f1() {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = _wrap_async_generator(function*() {});
    return _f1.apply(this, arguments);
}
//// [F2.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _wrap_async_generator(function*() {
        const x = yield;
    });
    return _f2.apply(this, arguments);
}
//// [F3.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = _wrap_async_generator(function*() {
        const x = yield 1;
    });
    return _f3.apply(this, arguments);
}
//// [F4.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f4() {
    return _f4.apply(this, arguments);
}
function _f4() {
    _f4 = _wrap_async_generator(function*() {
        const x = yield* _async_generator_delegate(_async_iterator([
            1
        ]), _await_async_generator);
    });
    return _f4.apply(this, arguments);
}
//// [F5.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f5() {
    return _f5.apply(this, arguments);
}
function _f5() {
    _f5 = _wrap_async_generator(function*() {
        const x = yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
            yield 1;
        })()), _await_async_generator);
    });
    return _f5.apply(this, arguments);
}
//// [F6.ts]
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f6() {
    return _f6.apply(this, arguments);
}
function _f6() {
    _f6 = _wrap_async_generator(function*() {
        const x = yield _await_async_generator(1);
    });
    return _f6.apply(this, arguments);
}
//// [F7.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function f7() {
    return _f7.apply(this, arguments);
}
function _f7() {
    _f7 = _wrap_async_generator(function*() {
        return 1;
    });
    return _f7.apply(this, arguments);
}
