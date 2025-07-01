//// [await_unaryExpression_es6_2.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
function bar1() {
    return _async_to_generator(function*() {
        delete (yield 42);
    })();
}
function bar2() {
    return _async_to_generator(function*() {
        delete (yield 42);
    })();
}
function bar3() {
    return _async_to_generator(function*() {
        void (yield 42);
    })();
}
