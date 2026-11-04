import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
let someFn = (xx, x, y)=>[
        x,
        y
    ], getArray = ()=>[
        1,
        2,
        3
    ];
_async_to_generator(function*() {
    console.log(someFn(1, (yield getArray()), (yield getArray())));
})(), _async_to_generator(function*() {
    console.log(someFn(1, (yield getArray()), (yield getArray())));
})();
