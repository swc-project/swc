import _async_generator_delegate from "@swc/helpers/lib/_async_generator_delegate.js";
import _async_iterator from "@swc/helpers/lib/_async_iterator.js";
import _await_async_generator from "@swc/helpers/lib/_await_async_generator.js";
import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
function f1() {
    return _f1.apply(this, arguments);
}
function _f1() {
    _f1 = // @target: es5
    // @lib: esnext
    // @filename: F1.ts
    _wrap_async_generator(function*() {});
    return _f1.apply(this, arguments);
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = // @filename: F2.ts
    _wrap_async_generator(function*() {
        const x = yield;
    });
    return _f2.apply(this, arguments);
}
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = // @filename: F3.ts
    _wrap_async_generator(function*() {
        const x = yield 1;
    });
    return _f3.apply(this, arguments);
}
function f4() {
    return _f4.apply(this, arguments);
}
function _f4() {
    _f4 = // @filename: F4.ts
    _wrap_async_generator(function*() {
        const x = yield* _async_generator_delegate(_async_iterator([
            1
        ]), _await_async_generator);
    });
    return _f4.apply(this, arguments);
}
function f5() {
    return _f5.apply(this, arguments);
}
function _f5() {
    _f5 = // @filename: F5.ts
    _wrap_async_generator(function*() {
        const x = yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
            yield 1;
        })()), _await_async_generator);
    });
    return _f5.apply(this, arguments);
}
function f6() {
    return _f6.apply(this, arguments);
}
function _f6() {
    _f6 = // @filename: F6.ts
    _wrap_async_generator(function*() {
        const x = yield _await_async_generator(1);
    });
    return _f6.apply(this, arguments);
}
function f7() {
    return _f7.apply(this, arguments);
}
function _f7() {
    _f7 = // @filename: F7.ts
    _wrap_async_generator(function*() {
        return 1;
    });
    return _f7.apply(this, arguments);
}
