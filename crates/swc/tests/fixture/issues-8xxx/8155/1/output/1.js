var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
let someFn = (xx, x, y)=>[
        x,
        y
    ], getArray = ()=>[
        1,
        2,
        3
    ], goodFunction = ()=>_async_to_generator._(function*() {
        console.log(someFn(1, (yield getArray()), (yield getArray())));
    })(), badFunction = ()=>_async_to_generator._(function*() {
        console.log(someFn(1, (yield getArray()), (yield getArray())));
    })();
goodFunction(), badFunction();
