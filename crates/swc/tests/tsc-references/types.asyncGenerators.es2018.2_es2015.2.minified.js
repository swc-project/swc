import _async_generator_delegate from "@swc/helpers/src/_async_generator_delegate.mjs";
import _async_iterator from "@swc/helpers/src/_async_iterator.mjs";
import _await_async_generator from "@swc/helpers/src/_await_async_generator.mjs";
import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
function _inferReturnType2() {
    return (_inferReturnType2 = _wrap_async_generator(function*() {
        yield* _async_generator_delegate(_async_iterator(function() {
            return _inferReturnType2.apply(this, arguments);
        }()), _await_async_generator);
    })).apply(this, arguments);
}
_wrap_async_generator(function*() {
    yield "a";
}), _wrap_async_generator(function*() {
    yield* _async_generator_delegate(_async_iterator([
        "a",
        "b"
    ]), _await_async_generator);
}), _wrap_async_generator(function*() {
    yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
        yield "a";
    })()), _await_async_generator);
}), _wrap_async_generator(function*() {
    yield "a";
}), _wrap_async_generator(function*() {
    yield* _async_generator_delegate(_async_iterator([
        "a",
        "b"
    ]), _await_async_generator);
}), _wrap_async_generator(function*() {
    yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
        yield "a";
    })()), _await_async_generator);
}), _wrap_async_generator(function*() {
    yield "a";
}), _wrap_async_generator(function*() {
    yield* _async_generator_delegate(_async_iterator([
        "a",
        "b"
    ]), _await_async_generator);
}), _wrap_async_generator(function*() {
    yield* _async_generator_delegate(_async_iterator(_wrap_async_generator(function*() {
        yield "a";
    })()), _await_async_generator);
});
