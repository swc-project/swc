import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function fn1() {
    return _fn1.apply(this, arguments);
}
function _fn1() {
    _fn1 = _async_to_generator(function*() {
        return {
            key: "value"
        };
    });
    return _fn1.apply(this, arguments);
}
function fn2() {
    return _fn2.apply(this, arguments);
}
function _fn2() {
    _fn2 = _async_to_generator(function*() {
        return new Promise((resolve)=>{
            resolve({
                key: "value"
            });
        });
    });
    return _fn2.apply(this, arguments);
}
function fn3() {
    return _fn3.apply(this, arguments);
}
function _fn3() {
    _fn3 = _async_to_generator(function*() {
        return yield {
            key: "value"
        };
    });
    return _fn3.apply(this, arguments);
}
function fn4() {
    return _fn4.apply(this, arguments);
}
function _fn4() {
    _fn4 = _async_to_generator(function*() {
        return yield new Promise((resolve)=>{
            resolve({
                key: "value"
            });
        });
    });
    return _fn4.apply(this, arguments);
}
