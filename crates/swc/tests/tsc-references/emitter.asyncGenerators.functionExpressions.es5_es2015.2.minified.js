import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
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
