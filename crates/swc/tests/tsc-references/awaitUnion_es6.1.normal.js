//// [awaitUnion_es6.ts]
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _async_to_generator(function*() {
        let await_a = yield a;
        let await_b = yield b;
        let await_c = yield c;
        let await_d = yield d;
        let await_e = yield e;
    });
    return _f.apply(this, arguments);
}
