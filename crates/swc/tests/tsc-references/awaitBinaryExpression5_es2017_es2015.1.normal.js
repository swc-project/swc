import * as swcHelpers from "@swc/helpers";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = swcHelpers.asyncToGenerator(function*() {
        before();
        var o;
        o.a = yield p;
        after();
    });
    return _func.apply(this, arguments);
}
