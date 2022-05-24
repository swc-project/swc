import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
// @target: esnext
// @strict: true
// #35995
function* f1() {
    return {
        x: 'x'
    };
}
function f2() {
    return _f2.apply(this, arguments);
}
function _f2() {
    _f2 = _wrap_async_generator(function*() {
        return {
            x: 'x'
        };
    });
    return _f2.apply(this, arguments);
}
function f3() {
    return _f3.apply(this, arguments);
}
function _f3() {
    _f3 = _wrap_async_generator(function*() {
        return Promise.resolve({
            x: 'x'
        });
    });
    return _f3.apply(this, arguments);
}
function f4() {
    return _f4.apply(this, arguments);
}
function _f4() {
    _f4 = _wrap_async_generator(function*() {
        const ret = {
            x: 'x'
        };
        return Promise.resolve(ret); // Error
    });
    return _f4.apply(this, arguments);
}
