import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @emitDeclarationOnly: true
// @strict: true
// @target: es6
// @declaration: true
// @filename: lateBoundClassMemberAssignmentJS2.js
var _sym = "my-fake-sym";
export var MyClass = /*#__PURE__*/ function() {
    "use strict";
    function MyClass() {
        swcHelpers.classCallCheck(this, MyClass);
        this[_sym] = "ok";
    }
    swcHelpers.createClass(MyClass, [
        {
            key: "method",
            value: function method() {
                this[_sym] = "yep";
                var x = this[_sym];
            }
        }
    ]);
    return MyClass;
}();
