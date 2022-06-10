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
        var self = this;
        self[_sym] = "ok";
    }
    var _proto = MyClass.prototype;
    _proto.method = function method() {
        var self = this;
        self[_sym] = "yep";
        var x = self[_sym];
    };
    return MyClass;
}();
