var _ref, _ref1;
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
let someFn = (xx, x, y)=>[
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
