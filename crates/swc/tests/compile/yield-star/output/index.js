import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
function g() {
    return _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator([
            1,
            2,
            3
        ]));
        yield* _async_generator_delegate(_async_iterator(iterable));
    })();
}
