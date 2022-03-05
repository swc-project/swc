import * as swcHelpers from "@swc/helpers";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = // @target: ES5
    // @lib: es5,es2015.promise
    // @noEmitHelpers: true
    swcHelpers.asyncToGenerator(function*() {
        return;
    });
    return _foo.apply(this, arguments);
}
