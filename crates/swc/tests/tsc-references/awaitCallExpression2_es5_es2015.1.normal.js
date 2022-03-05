import * as swcHelpers from "@swc/helpers";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = swcHelpers.asyncToGenerator(function*() {
        before();
        var b = fn((yield p), a, a);
        after();
    });
    return _func.apply(this, arguments);
}
