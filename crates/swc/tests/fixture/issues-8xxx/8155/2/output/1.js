import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
const someFn = (xx, x, y)=>[
        x,
        y
    ];
const getArray = ()=>[
        1,
        2,
        3
    ];
const goodFunction = function() {
    var _ref = _async_to_generator(function*() {
        const rb = yield getArray();
        const rc = yield getArray();
        console.log(someFn(1, rb, rc));
    });
    return function goodFunction() {
        return _ref.apply(this, arguments);
    };
}();
const badFunction = function() {
    var _ref = _async_to_generator(function*() {
        console.log(someFn(1, (yield getArray()), (yield getArray())));
    });
    return function badFunction() {
        return _ref.apply(this, arguments);
    };
}();
goodFunction();
badFunction();
