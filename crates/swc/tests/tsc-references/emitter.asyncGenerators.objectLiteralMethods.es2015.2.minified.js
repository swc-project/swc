//// [O1.ts]
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
let o1 = {
    f: ()=>_wrap_async_generator(function*() {})()
};
//// [O2.ts]
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
let o2 = {
    f: ()=>_wrap_async_generator(function*() {
            yield;
        })()
};
//// [O3.ts]
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
let o3 = {
    f: ()=>_wrap_async_generator(function*() {
            yield 1;
        })()
};
//// [O4.ts]
import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
let o4 = {
    f: ()=>_wrap_async_generator(function*() {
            yield* _async_generator_delegate(_async_iterator([
                1
            ]), _await_async_generator);
        })()
};
//// [O5.ts]
import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
let o5 = {
    f: ()=>_wrap_async_generator(function*() {
            yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
                yield 1;
            })()), _await_async_generator);
        })()
};
//// [O6.ts]
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
let o6 = {
    f: ()=>_wrap_async_generator(function*() {
            yield _await_async_generator(1);
        })()
};
//// [O7.ts]
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
let o7 = {
    f: ()=>_wrap_async_generator(function*() {
            return 1;
        })()
};
