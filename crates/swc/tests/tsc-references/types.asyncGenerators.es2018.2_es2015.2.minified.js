import _async_generator_delegate from "@swc/helpers/lib/_async_generator_delegate.js";
import _async_iterator from "@swc/helpers/lib/_async_iterator.js";
import _await_async_generator from "@swc/helpers/lib/_await_async_generator.js";
import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
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
