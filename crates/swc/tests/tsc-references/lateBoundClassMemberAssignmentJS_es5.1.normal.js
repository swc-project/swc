import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
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
        _class_call_check(this, MyClass);
        this[_sym] = "ok";
    }
    var _proto = MyClass.prototype;
    _proto.method = function method() {
        this[_sym] = "yep";
        var x = this[_sym];
    };
    return MyClass;
}();
