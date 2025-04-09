//// [await_unaryExpression_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
function bar() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        !(yield 42); // OK
    })();
}
function bar1() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        +(yield 42); // OK
    })();
}
function bar3() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        -(yield 42); // OK
    })();
}
function bar4() {
    return /*#__PURE__*/ _async_to_generator(function*() {
        ~(yield 42); // OK
    })();
}
