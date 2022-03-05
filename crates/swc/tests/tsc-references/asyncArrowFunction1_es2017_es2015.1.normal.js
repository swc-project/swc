import * as swcHelpers from "@swc/helpers";
// @target: es2017
// @noEmitHelpers: true
var foo = function() {
    var _ref = swcHelpers.asyncToGenerator(function*() {});
    return function foo() {
        return _ref.apply(this, arguments);
    };
}();
