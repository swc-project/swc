import * as swcHelpers from "@swc/helpers";
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = swcHelpers.asyncToGenerator(function*() {
        for(const key in {});
    });
    return _fn.apply(this, arguments);
}
