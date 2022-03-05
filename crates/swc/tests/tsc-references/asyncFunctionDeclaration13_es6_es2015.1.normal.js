import * as swcHelpers from "@swc/helpers";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = // @target: ES6
    // @noEmitHelpers: true
    swcHelpers.asyncToGenerator(function*() {
        // Legal to use 'await' in a type context.
        var v;
    });
    return _foo.apply(this, arguments);
}
