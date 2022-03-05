import * as swcHelpers from "@swc/helpers";
// @target: ES5
// @lib: es5,es2015.promise
// @noEmitHelpers: true
var foo = function() {
    var _ref = swcHelpers.asyncToGenerator(function*() {
        // Legal to use 'await' in a type context.
        var v;
    });
    return function foo() {
        return _ref.apply(this, arguments);
    };
}();
