"use strict";
var _ref, _ref1;
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(void 0);
        });
    };
}
const someFn = (xx, x, y)=>[
        x,
        y
    ], getArray = ()=>[
        1,
        2,
        3
    ], goodFunction = (_ref = _async_to_generator(function*() {
    console.log(someFn(1, (yield getArray()), (yield getArray())));
}), function() {
    return _ref.apply(this, arguments);
}), badFunction = (_ref1 = _async_to_generator(function*() {
    console.log(someFn(1, (yield getArray()), (yield getArray())));
}), function() {
    return _ref1.apply(this, arguments);
});
goodFunction(), badFunction();
