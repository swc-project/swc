import { _ as _async_generator_delegate } from "@swc/helpers/_/_async_generator_delegate";
import { _ as _async_iterator } from "@swc/helpers/_/_async_iterator";
import { _ as _await_async_generator } from "@swc/helpers/_/_await_async_generator";
import { _ as _wrap_async_generator } from "@swc/helpers/_/_wrap_async_generator";
const obj = {
    asyncYield () {
        return _wrap_async_generator(function*() {
            return yield _await_async_generator((yield* _async_generator_delegate(_async_iterator(nestedAsyncYield()))));
        })();
    }
};
