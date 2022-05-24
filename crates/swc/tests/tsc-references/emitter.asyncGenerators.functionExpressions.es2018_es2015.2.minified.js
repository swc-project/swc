import _async_generator_delegate from "@swc/helpers/lib/_async_generator_delegate.js";
import _async_iterator from "@swc/helpers/lib/_async_iterator.js";
import _await_async_generator from "@swc/helpers/lib/_await_async_generator.js";
import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
_wrap_async_generator(function*() {}), _wrap_async_generator(function*() {
    yield;
}), _wrap_async_generator(function*() {
    yield 1;
}), _wrap_async_generator(function*() {
    yield* _async_generator_delegate(_async_iterator([
        1
    ]), _await_async_generator);
}), _wrap_async_generator(function*() {
    yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
        yield 1;
    })()), _await_async_generator);
}), _wrap_async_generator(function*() {
    yield _await_async_generator(1);
}), _wrap_async_generator(function*() {
    return 1;
});
