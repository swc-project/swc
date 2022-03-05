import * as swcHelpers from "@swc/helpers";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = // @target: es2017
    // @noEmitHelpers: true
    swcHelpers.asyncToGenerator(function*() {
        return;
    });
    return _foo.apply(this, arguments);
}
