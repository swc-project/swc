//// [F1.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
_wrap_async_generator(function*() {});
//// [F2.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
_wrap_async_generator(function*() {
    yield;
});
//// [F3.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
_wrap_async_generator(function*() {
    yield 1;
});
//// [F4.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
_wrap_async_generator(function*() {
    yield* _async_generator_delegate(_async_iterator([
        1
    ]), _await_async_generator);
});
//// [F5.ts]
import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
_wrap_async_generator(function*() {
    yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
        yield 1;
    })()), _await_async_generator);
});
//// [F6.ts]
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
_wrap_async_generator(function*() {
    yield _await_async_generator(1);
});
//// [F7.ts]
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
_wrap_async_generator(function*() {
    return 1;
});
