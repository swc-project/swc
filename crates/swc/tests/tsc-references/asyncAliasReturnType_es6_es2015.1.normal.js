import * as swcHelpers from "@swc/helpers";
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = swcHelpers.asyncToGenerator(function*() {});
    return _f.apply(this, arguments);
}
