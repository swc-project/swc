//// [asyncUnParenthesizedArrowFunction_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
const x = (i)=>_async_to_generator(function*() {
        return yield someOtherFunction(i);
    })();
const x1 = (i)=>_async_to_generator(function*() {
        return yield someOtherFunction(i);
    })();
