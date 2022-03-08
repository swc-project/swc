import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @emitDeclarationOnly: true
// @strict: true
// @target: es6
// @declaration: true
// @filename: lateBoundClassMemberAssignmentJS.js
var _sym = Symbol("_sym");
export var MyClass = /*#__PURE__*/ function() {
    "use strict";
    function MyClass() {
        swcHelpers.classCallCheck(this, MyClass);
        this[_sym] = "ok";
    }
    var _proto = MyClass.prototype;
    _proto.method = function method() {
        this[_sym] = "yep";
        var x = this[_sym];
    };
    return MyClass;
}();
