//// [asyncUnParenthesizedArrowFunction_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
_async_to_generator(function*(i) {
    return yield someOtherFunction(i);
}), _async_to_generator(function*(i) {
    return yield someOtherFunction(i);
});
