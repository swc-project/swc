var _async_generator_delegate = require("@swc/helpers/_/_async_generator_delegate");
var _async_iterator = require("@swc/helpers/_/_async_iterator");
var _wrap_async_generator = require("@swc/helpers/_/_wrap_async_generator");
function g() {
    return _g.apply(this, arguments);
}
function _g() {
    _g = _wrap_async_generator._(function*() {
        yield* _async_generator_delegate._(_async_iterator._([
            1,
            2,
            3
        ]));
        yield* _async_generator_delegate._(_async_iterator._(iterable));
    });
    return _g.apply(this, arguments);
}
