//// [awaitUnion_es6.ts]
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    return (_f = _async_to_generator(function*() {
        yield a, yield b, yield c, yield d, yield e;
    })).apply(this, arguments);
}
