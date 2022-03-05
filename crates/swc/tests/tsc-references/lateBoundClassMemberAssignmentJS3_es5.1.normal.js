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
        var self = this;
        self[_sym] = "ok";
    }
    swcHelpers.createClass(MyClass, [
        {
            key: "method",
            value: function method() {
                var self = this;
                self[_sym] = "yep";
                var x = self[_sym];
            }
        }
    ]);
    return MyClass;
}();
