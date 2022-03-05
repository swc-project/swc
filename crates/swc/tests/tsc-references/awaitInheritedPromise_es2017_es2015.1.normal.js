import * as swcHelpers from "@swc/helpers";
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = swcHelpers.asyncToGenerator(function*() {
        yield a;
    });
    return _f.apply(this, arguments);
}
