import * as swcHelpers from "@swc/helpers";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = swcHelpers.asyncToGenerator(function*() {
        before();
        var b = fn(a, (yield p), a);
        after();
    });
    return _func.apply(this, arguments);
}
