import * as swcHelpers from "@swc/helpers";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = swcHelpers.asyncToGenerator(function*() {
        "use strict";
        var b = (yield p) || a;
    });
    return _func.apply(this, arguments);
}
