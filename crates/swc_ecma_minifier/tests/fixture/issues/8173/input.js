"use strict";
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function () {
        var self = this, args = arguments;
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
const someFn = (xx, x, y) => [
    x,
    y
];
const getArray = () => [
    1,
    2,
    3
];
const goodFunction = function () {
    var _ref = _async_to_generator(function* () {
        const rb = yield getArray();
        const rc = yield getArray();
        console.log(someFn(1, rb, rc));
    });
    return function goodFunction() {
        return _ref.apply(this, arguments);
    };
}();
const badFunction = function () {
    var _ref = _async_to_generator(function* () {
        console.log(someFn(1, (yield getArray()), (yield getArray())));
    });
    return function badFunction() {
        return _ref.apply(this, arguments);
    };
}();
goodFunction();
badFunction();
