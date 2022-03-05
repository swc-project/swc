import * as swcHelpers from "@swc/helpers";
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = swcHelpers.asyncToGenerator(function*() {
        let await_a = yield a;
        let await_b = yield b;
        let await_c = yield c;
        let await_d = yield d;
        let await_e = yield e;
    });
    return _f.apply(this, arguments);
}
