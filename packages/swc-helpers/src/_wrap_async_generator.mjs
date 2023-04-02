import _async_generator from "./_async_generator.mjs";
export default function _wrap_async_generator(fn) {
    return function() {
        return new _async_generator(fn.apply(this, arguments));
    };
}
