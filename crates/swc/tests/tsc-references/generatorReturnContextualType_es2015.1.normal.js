import * as swcHelpers from "@swc/helpers";
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
    _f2 = swcHelpers.wrapAsyncGenerator(function*() {
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
    _f3 = swcHelpers.wrapAsyncGenerator(function*() {
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
    _f4 = swcHelpers.wrapAsyncGenerator(function*() {
        const ret = {
            x: 'x'
        };
        return Promise.resolve(ret); // Error
    });
    return _f4.apply(this, arguments);
}
